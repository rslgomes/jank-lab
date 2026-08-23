import { buildStrategies } from "../config/render/index.js";
import { renderChoices, syncChoices } from "./controls.js";
import { state } from "../state.js";

export function initInsertionSettings(onChange) {
  const strategyField = document.getElementById("build-strategy");

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

  function sync() {
    syncChoices(strategyField, "build-strategy", state.buildStrategy);
  }

  return { sync };
}
