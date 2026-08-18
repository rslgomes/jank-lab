import { initDataSettings } from "./data.js";
import { initInsertionSettings } from "./insertion.js";
import { initLayoutSettings } from "./layout.js";
import { initPaintSettings } from "./paint.js";
import { initWindowSettings } from "./window.js";
import { rowCountSteps, state } from "../state.js";
import { saveStateToUrl } from "../url_state.js";

const CONFIRM_ROW_THRESHOLD = rowCountSteps[4];

export function initSettings(onRun) {
  const cta = document.getElementById("new-render");

  function onChange() {
    saveStateToUrl();
  }

  const data = initDataSettings(onChange);
  initInsertionSettings(onChange);
  initWindowSettings(onChange);
  initLayoutSettings(onChange);
  initPaintSettings(onChange);

  function confirmLargeRun() {
    if (state.rowCount < CONFIRM_ROW_THRESHOLD) return true;

    return confirm(
      `${state.rowCount.toLocaleString()} rows may freeze the page for a while, depending on the current settings.\n\nThat is the point of this lab — but the tab will stop responding until it finishes.\n\nRun anyway?`,
    );
  }

  function runAndSync() {
    onRun();
    data.showCacheSize();
  }

  cta.addEventListener("click", () => {
    if (confirmLargeRun()) runAndSync();
  });

  onChange();

  return runAndSync;
}
