import { formatCount } from "../format.js";
import { rowCountSteps, state, stepForRowCount } from "../state.js";

export function initDataSettings(onChange) {
  const rowCount = document.getElementById("row-count");
  const rowCountOutput = document.getElementById("row-count-output");
  const sources = document.querySelectorAll('[name="data-source"]');

  function syncRowCount() {
    state.rowCount = rowCountSteps[rowCount.value];
    rowCountOutput.textContent = formatCount(state.rowCount);
    onChange();
  }

  rowCount.value = stepForRowCount(state.rowCount);
  rowCountOutput.textContent = formatCount(state.rowCount);

  sources.forEach((input) => {
    input.checked = input.value === state.dataSource;
    input.addEventListener("change", () => {
      if (input.checked) state.dataSource = input.value;
      onChange();
    });
  });

  rowCount.addEventListener("input", syncRowCount);
}
