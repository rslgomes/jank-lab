import { renderChoices } from "./controls.js";
import { state } from "../state.js";
import { virtualizationModes } from "../config/virtualization/index.js";

export function initWindowSettings(onChange) {
  const virtualizationField = document.getElementById("virtualization-mode");
  const bufferField = document.getElementById("buffer-field");
  const bufferInput = document.getElementById("buffer-rows");
  const bufferOutput = document.getElementById("buffer-output");

  function syncBufferVisibility() {
    bufferField.hidden = state.virtualization === "off";
  }

  renderChoices(
    virtualizationField,
    "virtualization-mode",
    Object.entries(virtualizationModes),
    state.virtualization,
    (value) => {
      state.virtualization = value;
      syncBufferVisibility();
      onChange();
    },
  );

  bufferInput.value = String(state.bufferRows);
  bufferOutput.textContent = String(state.bufferRows);

  bufferInput.addEventListener("input", () => {
    state.bufferRows = Number(bufferInput.value);
    bufferOutput.textContent = bufferInput.value;
    onChange();
  });

  syncBufferVisibility();
}
