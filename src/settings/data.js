import { cacheSummary, clearRowCache } from "../config/data/rows.js";
import { formatCount } from "../format.js";
import { rowCountSteps, state, stepForRowCount } from "../state.js";

export function initDataSettings(onChange) {
  const rowCount = document.getElementById("row-count");
  const rowCountOutput = document.getElementById("row-count-output");
  const cacheToggle = document.getElementById("cache-toggle");
  const clearCache = document.getElementById("clear-cache");
  const cacheReadout = document.getElementById("cache-readout");
  const flagsToggle = document.getElementById("flags-toggle");
  const sources = document.querySelectorAll('[name="data-source"]');

  function showCacheSize() {
    const { datasets, rows } = cacheSummary();

    cacheReadout.textContent =
      datasets === 0
        ? "cache empty"
        : `${datasets} dataset${datasets === 1 ? "" : "s"} held, ${formatCount(rows)} rows retained`;
  }

  function syncRowCount() {
    state.rowCount = rowCountSteps[rowCount.value];
    rowCountOutput.textContent = formatCount(state.rowCount);
    onChange();
  }

  function sync() {
    rowCount.value = stepForRowCount(state.rowCount);
    rowCountOutput.textContent = formatCount(state.rowCount);
    cacheToggle.checked = state.cache;
    flagsToggle.checked = state.showFlags;

    for (const input of sources) {
      input.checked = input.value === state.dataSource;
    }
  }

  sync();

  sources.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) state.dataSource = input.value;
      onChange();
    });
  });

  rowCount.addEventListener("input", syncRowCount);

  cacheToggle.addEventListener("change", () => {
    state.cache = cacheToggle.checked;
    onChange();
  });

  flagsToggle.addEventListener("change", () => {
    state.showFlags = flagsToggle.checked;
    onChange();
  });

  clearCache.addEventListener("click", () => {
    clearRowCache();
    showCacheSize();
  });

  showCacheSize();

  return { sync, showCacheSize };
}
