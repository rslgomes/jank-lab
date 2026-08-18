import { presets } from "../config/presets/index.js";
import { state } from "../state.js";

export function initPresetSettings(onApply) {
  const list = document.getElementById("preset-list");
  const readout = document.getElementById("preset-readout");
  const fragment = document.createDocumentFragment();

  for (const [id, { label }] of Object.entries(presets)) {
    const button = document.createElement("button");
    button.className = "preset";
    button.type = "button";
    button.dataset.preset = id;
    button.textContent = label;

    fragment.append(button);
  }

  list.append(fragment);

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;

    const { label, values } = presets[button.dataset.preset];

    Object.assign(state, values, { containment: { ...values.containment } });
    readout.textContent = `${label} applied`;
    onApply();
  });
}
