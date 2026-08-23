const STATUS_LABELS = {
  active: "ACT",
  idle: "IDL",
  failed: "ERR",
};

const FLAG_BASE = "/assets/flags/";
const FLAG_WIDTH = 20;
const FLAG_HEIGHT = 14;
const COUNTRY_CLASS = "row__country";

let showFlags = false;

export function setShowFlags(value) {
  showFlags = value;
}

const CELLS = [
  ["row__index", (row) => row.index],
  ["row__id", (row) => row.id],
  ["row__status", (row) => STATUS_LABELS[row.status]],
  ["row__name", (row) => row.name],
  ["row__email", (row) => row.email],
  ["row__company", (row) => row.company],
  ["row__role", (row) => row.role],
  [COUNTRY_CLASS, (row) => row.country],
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

function flagMarkup(code) {
  const safe = escapeHtml(code);

  return `<img class="row__flag" src="${FLAG_BASE}${safe}.png" alt="${safe}" width="${FLAG_WIDTH}" height="${FLAG_HEIGHT}" loading="lazy" />`;
}

function cellContent(className, value) {
  if (className === COUNTRY_CLASS && showFlags) return flagMarkup(value);

  return escapeHtml(value);
}

export function rowsHtml(rows, startIndex) {
  let html = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let cells = "";

    for (const [className, read] of CELLS) {
      cells += `<span class="${className}">${cellContent(className, read(row))}</span>`;
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

function fillCountryCell(cell, code) {
  if (!showFlags) {
    if (cell.firstElementChild) cell.replaceChildren();
    if (cell.textContent !== code) cell.textContent = code;
    return;
  }

  let image = cell.firstElementChild;

  if (!image) {
    cell.replaceChildren();
    image = document.createElement("img");
    image.className = "row__flag";
    image.width = FLAG_WIDTH;
    image.height = FLAG_HEIGHT;
    image.loading = "lazy";
    cell.append(image);
  }

  if (image.alt !== code) {
    image.alt = code;
    image.src = `${FLAG_BASE}${code}.png`;
  }
}

export function fillRowElement(element, row, index) {
  element.dataset.status = row.status;
  element.dataset.parity = parity(index);

  const cells = element.children;

  for (let i = 0; i < CELLS.length; i++) {
    const [className, read] = CELLS[i];
    const value = read(row);

    if (className === COUNTRY_CLASS) {
      fillCountryCell(cells[i], value);
      continue;
    }

    if (cells[i].textContent !== value) cells[i].textContent = value;
  }
}
