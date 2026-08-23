import { beforeReplace } from "./config/memory/index.js";
import { buildStrategies } from "./config/render/index.js";
import { generateRowsChunked } from "./config/data/rows.js";
import { setShowFlags } from "./config/render/row_shape.js";
import { initMarquee } from "./super_header/marquee.js";
import { initRuns } from "./runs/dialog.js";
import { initSettings } from "./settings/index.js";
import { closeMenu, initMenu } from "./menu.js";
import { loadStateFromUrl } from "./url_state.js";
import { state } from "./state.js";
import { beginRun, endRun, startStep, yieldedSoFar } from "./loading.js";
import { virtualizationModes } from "./config/virtualization/index.js";
import {
  attachDelegated,
  attachPerRow,
  toggleRowSelection,
} from "./config/events/methods.js";
import {
  beginFrameCapture,
  endFrameCapture,
  measureAsync,
  observeFrames,
  showMetrics,
  timeToPaint,
} from "./metrics/index.js";

function enabledContainment(containment) {
  const enabled = Object.entries(containment)
    .filter(([, on]) => on)
    .map(([key]) => key);

  return enabled.length ? enabled.join("+") : "none";
}

function App() {
  const scroller = document.getElementById("rows-list");
  const surface = document.getElementById("rows-surface");
  const runs = initRuns({ beforeOpen: closeMenu });

  let list = null;
  let listKey = "";

  function currentList() {
    const key = `${state.virtualization}:${state.bufferRows}`;

    if (list && key === listKey) return list;

    list?.destroy();
    list = virtualizationModes[state.virtualization].create({
      scroller,
      surface,
      bufferRows: state.bufferRows,
    });
    listKey = key;

    return list;
  }

  async function run() {
    beginRun();
    await startStep("Generating data");

    const startedAt = performance.now();
    const yieldedBefore = yieldedSoFar();
    beginFrameCapture();

    const generated = await measureAsync("generate", () =>
      generateRowsChunked(state.rowCount, {
        source: state.dataSource,
        cache: state.cache,
        scheduling: state.scheduling,
        chunkRows: state.chunkRows,
      }),
    );

    await startStep("Building DOM");

    setShowFlags(state.showFlags);

    const strategy = buildStrategies[state.buildStrategy].render;
    const target = currentList();

    beforeReplace(
      Array.from(surface.querySelectorAll(".row")),
      state.memoryStrategy,
    );

    const rendered = await measureAsync("render", () =>
      target.render(generated.result, strategy, {
        scheduling: state.scheduling,
        chunkRows: state.chunkRows,
      }),
    );

    if (state.eventStrategy === "per_row") {
      attachPerRow(
        Array.from(surface.querySelectorAll(".row")),
        toggleRowSelection,
      );
    }

    showMetrics({
      "row-count": state.rowCount,
      "dom-rows": rendered.result,
      generate: generated.duration,
      render: rendered.duration,
    });

    await startStep("Painting");

    const reachedPaint = await timeToPaint(startedAt);
    const styleLayout = await endFrameCapture();

    endRun();

    const painted = reachedPaint - (yieldedSoFar() - yieldedBefore);

    showMetrics({ painted, "style-layout": styleLayout });

    runs.record({
      rows: state.rowCount,
      domRows: rendered.result,
      source: state.dataSource,
      flags: state.showFlags ? "on" : "off",
      insertion: state.buildStrategy,
      virtualization: state.virtualization,
      layout: state.layoutStrategy,
      paint: enabledContainment(state.containment),
      scheduling: state.scheduling,
      events: state.eventStrategy,
      memory: state.memoryStrategy,
      generate: generated.duration,
      render: rendered.duration,
      styleLayout,
      painted,
    });
  }

  loadStateFromUrl();
  observeFrames();
  initMenu();
  initMarquee(document.querySelector(".super-header__track"));
  attachDelegated(
    surface,
    toggleRowSelection,
    () => state.eventStrategy === "delegated",
  );

  const runAndSync = initSettings(run);
  runAndSync();
}

App();
