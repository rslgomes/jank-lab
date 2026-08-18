import { renderChoices, syncChoices } from "./controls.js";
import { schedulingModes } from "../config/scheduling/index.js";
import { state } from "../state.js";

export function initTimeSettings(onChange) {
  const strategyField = document.getElementById("scheduling-mode");
  const chunkField = document.getElementById("chunk-field");
  const chunkInput = document.getElementById("chunk-rows");
  const chunkOutput = document.getElementById("chunk-output");

  function syncChunkVisibility() {
    chunkField.hidden = !schedulingModes[state.scheduling].chunked;
  }

  renderChoices(
    strategyField,
    "scheduling-mode",
    Object.entries(schedulingModes),
    state.scheduling,
    (value) => {
      state.scheduling = value;
      syncChunkVisibility();
      onChange();
    },
  );

  function sync() {
    syncChoices(strategyField, "scheduling-mode", state.scheduling);
    chunkInput.value = String(state.chunkRows);
    chunkOutput.textContent = String(state.chunkRows);
    syncChunkVisibility();
  }

  sync();

  chunkInput.addEventListener("input", () => {
    state.chunkRows = Number(chunkInput.value);
    chunkOutput.textContent = chunkInput.value;
    onChange();
  });

  return { sync };
}
