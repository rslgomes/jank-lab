import { containmentToggles } from "../config/containment/index.js";
import { renderToggles, syncToggles } from "./controls.js";
import { state } from "../state.js";

export function initPaintSettings(onChange) {
  const surface = document.getElementById("rows-surface");
  const field = document.getElementById("containment-toggles");

  function syncAttributes() {
    surface.toggleAttribute("data-contain", state.containment.contain);
    surface.toggleAttribute(
      "data-content-visibility",
      state.containment.contentVisibility,
    );
    surface.toggleAttribute("data-will-change", state.containment.willChange);
  }

  renderToggles(
    field,
    Object.entries(containmentToggles),
    (key) => state.containment[key],
    (key, checked) => {
      state.containment[key] = checked;
      syncAttributes();
      onChange();
    },
  );

  function sync() {
    syncToggles(field, (key) => state.containment[key]);
    syncAttributes();
  }

  sync();

  return { sync };
}
