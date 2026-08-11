import { buildStrategies } from "./config/render/index.js";
import { generateRows } from "./config/data/rows.js";
import { initMenu } from "./menu.js";
import { initSettings } from "./settings/index.js";
import { loadStateFromUrl } from "./url_state.js";
import { measure, showMetrics } from "./metrics/index.js";
import { state } from "./state.js";
import { virtualizationModes } from "./config/virtualization/index.js";

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

  function run() {
    const generated = measure("generate", () =>
      generateRows(state.rowCount, {
        source: state.dataSource,
        cache: state.cache,
      }),
    );

    const strategy = buildStrategies[state.buildStrategy].render;
    const target = currentList();

    const rendered = measure("render", () =>
      target.render(generated.result, strategy),
    );

    showMetrics({
      "row-count": state.rowCount,
      "dom-rows": rendered.result,
      generate: generated.duration,
      render: rendered.duration,
    });
  }

  loadStateFromUrl();
  initMenu();

  const runAndSync = initSettings(run);
  runAndSync();
}

App();
