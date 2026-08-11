import { buildStrategies } from "./config/render/index.js";
import { generateRows } from "./config/data/rows.js";
import { initMenu } from "./menu.js";
import { initSettings } from "./settings/index.js";
import { loadStateFromUrl } from "./url_state.js";
import { measure, showMetrics } from "./metrics/index.js";
import { state } from "./state.js";

function App() {
  const surface = document.getElementById("rows-surface");

  function run() {
    const generated = measure("generate", () =>
      generateRows(state.rowCount, { source: state.dataSource }),
    );

    const rendered = measure("render", () =>
      buildStrategies[state.buildStrategy].render(surface, generated.result, 0),
    );

    showMetrics({
      "row-count": state.rowCount,
      "dom-rows": surface.children.length,
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
