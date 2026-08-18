import { initDataSettings } from "./data.js";
import { initInsertionSettings } from "./insertion.js";
import { initLayoutSettings } from "./layout.js";
import { initMemorySettings } from "./memory.js";
import { initPaintSettings } from "./paint.js";
import { initPresetSettings } from "./presets.js";
import { initTimeSettings } from "./time.js";
import { initWindowSettings } from "./window.js";
import { saveStateToUrl } from "../url_state.js";
import { state } from "../state.js";
import { warningsFor } from "../risk.js";

export function initSettings(onRun) {
  const cta = document.getElementById("new-render");

  function onChange() {
    saveStateToUrl();
  }

  const data = initDataSettings(onChange);
  const insertion = initInsertionSettings(onChange);
  const windowing = initWindowSettings(onChange);
  const layout = initLayoutSettings(onChange);
  const paint = initPaintSettings(onChange);
  const time = initTimeSettings(onChange);
  const memory = initMemorySettings(onChange);

  const panels = [data, insertion, windowing, layout, paint, time, memory];

  function syncControls() {
    for (const panel of panels) panel.sync();
  }

  function confirmRun() {
    const warnings = warningsFor(state);

    if (warnings.length === 0) return true;

    const listed = warnings.map((warning) => `\u2022 ${warning}`).join("\n");

    return confirm(
      `${state.rowCount.toLocaleString()} rows, and this combination is expensive:\n\n${listed}\n\nThat is the point of this lab — but the tab may stop responding until it finishes.\n\nRun anyway?`,
    );
  }

  async function runAndSync() {
    cta.disabled = true;
    await onRun();
    cta.disabled = false;

    data.showCacheSize();
    memory.report();
  }

  initPresetSettings(() => {
    syncControls();
    onChange();
    if (confirmRun()) runAndSync();
  });

  cta.addEventListener("click", () => {
    if (confirmRun()) runAndSync();
  });

  onChange();

  return runAndSync;
}
