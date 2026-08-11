import { buildStrategies } from "../config/render/index.js";
import { renderChoices } from "./controls.js";
import { state } from "../state.js";
import { verifyStrategies } from "../config/render/verify.js";
import { virtualizationModes } from "../config/virtualization/index.js";

export function initBuildSettings(onChange) {
  const strategyField = document.getElementById("build-strategy");
  const virtualizationField = document.getElementById("virtualization-mode");
  const bufferField = document.getElementById("buffer-field");
  const bufferInput = document.getElementById("buffer-rows");
  const bufferOutput = document.getElementById("buffer-output");
  const verifyButton = document.getElementById("verify-strategies");
  const verifyResult = document.getElementById("verify-result");

  function syncBufferVisibility() {
    bufferField.hidden = state.virtualization === "off";
  }

  renderChoices(
    strategyField,
    "build-strategy",
    Object.entries(buildStrategies),
    state.buildStrategy,
    (value) => {
      state.buildStrategy = value;
      onChange();
    },
  );

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

  verifyButton.addEventListener("click", () => {
    const { total, mismatched } = verifyStrategies();

    verifyResult.textContent =
      mismatched.length === 0
        ? `all ${total} strategies produce identical DOM`
        : `different DOM: ${mismatched.join(", ")}`;
  });

  syncBufferVisibility();
}
