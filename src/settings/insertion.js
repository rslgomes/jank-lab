import { buildStrategies } from "../config/render/index.js";
import { renderChoices } from "./controls.js";
import { state } from "../state.js";
import { verifyStrategies } from "../config/render/verify.js";

export function initInsertionSettings(onChange) {
  const strategyField = document.getElementById("build-strategy");
  const verifyButton = document.getElementById("verify-strategies");
  const verifyResult = document.getElementById("verify-result");

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

  verifyButton.addEventListener("click", () => {
    const { total, mismatched } = verifyStrategies();

    verifyResult.textContent =
      mismatched.length === 0
        ? `all ${total} strategies produce identical DOM`
        : `different DOM: ${mismatched.join(", ")}`;
  });
}
