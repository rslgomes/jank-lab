import { CELL_CLASSES } from "../render/row_shape.js";

export function markOverflowInterleaved(rowElements) {
  let flagged = 0;

  for (const row of rowElements) {
    const cells = row.children;

    for (let i = 0; i < CELL_CLASSES.length; i++) {
      const cell = cells[i];
      const overflowing = cell.scrollWidth > cell.clientWidth;
      const next = overflowing ? "1" : "0";

      if (cell.dataset.overflow !== next) cell.dataset.overflow = next;
      if (overflowing) flagged++;
    }
  }

  return flagged;
}

export function markOverflowBatched(rowElements) {
  const cells = [];

  for (const row of rowElements) {
    for (let i = 0; i < CELL_CLASSES.length; i++) {
      cells.push(row.children[i]);
    }
  }

  const overflowing = cells.map((cell) => cell.scrollWidth > cell.clientWidth);
  let flagged = 0;

  for (let i = 0; i < cells.length; i++) {
    const next = overflowing[i] ? "1" : "0";

    if (cells[i].dataset.overflow !== next) cells[i].dataset.overflow = next;
    if (overflowing[i]) flagged++;
  }

  return flagged;
}
