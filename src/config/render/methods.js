import { createRowElement, fillRowElement, rowsHtml } from "./row_shape.js";

export function withInnerHTML(parent, rows, startIndex) {
  parent.innerHTML = rowsHtml(rows, startIndex);
}

export function withInsertAdjacentHtml(parent, rows, startIndex) {
  parent.replaceChildren();
  parent.insertAdjacentHTML("beforeend", rowsHtml(rows, startIndex));
}

export function withRange(parent, rows, startIndex) {
  const range = document.createRange();

  range.selectNodeContents(parent);
  parent.replaceChildren(
    range.createContextualFragment(rowsHtml(rows, startIndex)),
  );
}

export function withCreateElement(parent, rows, startIndex) {
  parent.replaceChildren();

  for (let i = 0; i < rows.length; i++) {
    const element = createRowElement();
    fillRowElement(element, rows[i], startIndex + i);
    parent.append(element);
  }
}

export function withFragment(parent, rows, startIndex) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rows.length; i++) {
    const element = createRowElement();
    fillRowElement(element, rows[i], startIndex + i);
    fragment.append(element);
  }

  parent.replaceChildren(fragment);
}

let blankRow = null;
export function withTemplate(parent, rows, startIndex) {
  function prototypeRow() {
    if (blankRow) return blankRow;

    const template = document.createElement("template");
    template.content.append(createRowElement());
    blankRow = template.content.firstElementChild;

    return blankRow;
  }
  const blank = prototypeRow();
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rows.length; i++) {
    const element = blank.cloneNode(true);
    fillRowElement(element, rows[i], startIndex + i);
    fragment.append(element);
  }

  parent.replaceChildren(fragment);
}

export function withRecycling(parent, rows, startIndex) {
  const existing = parent.children;

  for (let i = existing.length; i < rows.length; i++) {
    parent.append(createRowElement());
  }

  while (existing.length > rows.length) {
    parent.lastElementChild.remove();
  }

  for (let i = 0; i < rows.length; i++) {
    fillRowElement(existing[i], rows[i], startIndex + i);
  }
}
