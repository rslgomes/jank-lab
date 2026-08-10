const STATUS_LABELS = {
  active: "ACT",
  idle: "IDL",
  failed: "ERR",
};

const CELLS = [
  ["row__index", (row) => row.index],
  ["row__id", (row) => row.id],
  ["row__status", (row) => STATUS_LABELS[row.status]],
  ["row__name", (row) => row.name],
  ["row__email", (row) => row.email],
  ["row__company", (row) => row.company],
  ["row__role", (row) => row.role],
  ["row__country", (row) => row.country],
  ["row__dob", (row) => row.dob],
  ["row__amount", (row) => row.amount],
];

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (character) => HTML_ESCAPES[character]);
}

function parity(index) {
  return index % 2 === 0 ? "even" : "odd";
}

export function rowsHtml(rows, startIndex) {
  let html = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let cells = "";

    for (const [className, read] of CELLS) {
      cells += `<span class="${className}">${escapeHtml(read(row))}</span>`;
    }

    html += `<div class="row" data-status="${row.status}" data-parity="${parity(startIndex + i)}">${cells}</div>`;
  }

  return html;
}

export const CELL_CLASSES = CELLS.map(([className]) => className);

export function createRowElement() {
  const element = document.createElement("div");

  element.className = "row";
  element.dataset.status = "";
  element.dataset.parity = "";

  for (const [className] of CELLS) {
    const cell = document.createElement("span");
    cell.className = className;
    element.append(cell);
  }

  return element;
}

export function fillRowElement(element, row, index) {
  element.dataset.status = row.status;
  element.dataset.parity = parity(index);

  const cells = element.children;

  for (let i = 0; i < CELLS.length; i++) {
    const [, read] = CELLS[i];
    const value = read(row);

    if (cells[i].textContent !== value) cells[i].textContent = value;
  }
}
