export function renderChoices(fieldset, name, entries, selected, onPick) {
  const fragment = document.createDocumentFragment();

  for (const [value, { label, hint }] of entries) {
    const choice = document.createElement("label");
    choice.className = "choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = value === selected;

    const text = document.createElement("span");
    text.textContent = label;

    const note = document.createElement("span");
    note.className = "choice__hint";
    note.textContent = hint;

    text.append(" ", note);
    choice.append(input, text);
    fragment.append(choice);
  }

  fieldset.append(fragment);

  fieldset.addEventListener("change", (event) => {
    if (event.target.name === name) onPick(event.target.value);
  });
}

export function syncChoices(fieldset, name, selected) {
  for (const input of fieldset.querySelectorAll(`input[name="${name}"]`)) {
    input.checked = input.value === selected;
  }
}

export function renderToggles(fieldset, entries, isChecked, onToggle) {
  const fragment = document.createDocumentFragment();

  for (const [key, { label, hint }] of entries) {
    const choice = document.createElement("label");
    choice.className = "choice";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.key = key;
    input.checked = isChecked(key);

    const text = document.createElement("span");
    text.textContent = label;

    const note = document.createElement("span");
    note.className = "choice__hint";
    note.textContent = hint;

    text.append(" ", note);
    choice.append(input, text);
    fragment.append(choice);
  }

  fieldset.append(fragment);

  fieldset.addEventListener("change", (event) => {
    if (event.target.dataset.key) {
      onToggle(event.target.dataset.key, event.target.checked);
    }
  });
}

export function syncToggles(fieldset, isChecked) {
  for (const input of fieldset.querySelectorAll("input[data-key]")) {
    input.checked = isChecked(input.dataset.key);
  }
}
