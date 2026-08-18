import { beforeReplace } from "./config/memory/index.js";
import { buildStrategies } from "./config/render/index.js";
import { generateRowsChunked } from "./config/data/rows.js";
import { initMarquee } from "./super_header/marquee.js";
import { initMenu } from "./menu.js";
import { initSettings } from "./settings/index.js";
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

function App() {
  const scroller = document.getElementById("rows-list");
  const surface = document.getElementById("rows-surface");

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

    showMetrics({
      painted: reachedPaint - (yieldedSoFar() - yieldedBefore),
      "style-layout": styleLayout,
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
