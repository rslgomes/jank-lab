import { buildStrategies } from "./render/index.js";
import { generateRows } from "./data/rows.js";
import { initMenu } from "./menu.js";
import { initSettings } from "./settings/index.js";
import { loadStateFromUrl } from "./url_state.js";
import { state } from "./state.js";

function App() {
  const surface = document.getElementById("rows-surface");

  function run() {
    const rows = generateRows(state.rowCount, { source: state.dataSource });

    buildStrategies[state.buildStrategy].render(surface, rows, 0);
  }

  loadStateFromUrl();
  initMenu();

  const runAndSync = initSettings(run);
  runAndSync();
}

App();
