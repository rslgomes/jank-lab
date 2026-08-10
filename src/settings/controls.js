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
