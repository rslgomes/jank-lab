import { formatCount, formatMs } from "../format.js";
import { layoutStrategies } from "../config/layout/index.js";
import { measure } from "../metrics/index.js";
import { renderChoices, syncChoices } from "./controls.js";
import { state } from "../state.js";

export function initLayoutSettings(onChange) {
  const strategyField = document.getElementById("layout-strategy");
  const runButton = document.getElementById("detect-overflow");
  const result = document.getElementById("layout-result");

  renderChoices(
    strategyField,
    "layout-strategy",
    Object.entries(layoutStrategies),
    state.layoutStrategy,
    (value) => {
      state.layoutStrategy = value;
      onChange();
    },
  );

  function sync() {
    syncChoices(strategyField, "layout-strategy", state.layoutStrategy);
  }

  runButton.addEventListener("click", () => {
    const rows = document.querySelectorAll("#rows-surface .row");

    if (rows.length === 0) {
      result.textContent = "no rows on screen — render first";
      return;
    }

    const pass = measure("layout-pass", () =>
      layoutStrategies[state.layoutStrategy].run(rows),
    );

    result.textContent = `${formatCount(rows.length)} rows scanned, ${pass.result} overflowing, ${formatMs(pass.duration)}`;
  });

  return { sync };
}
