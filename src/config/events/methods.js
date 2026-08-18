let attached = false;
let lastAttach = { count: 0, duration: 0 };

export function toggleRowSelection(row) {
  row.dataset.selected = row.dataset.selected === "1" ? "0" : "1";
}

export function attachDelegated(container, onRowClick, isActive) {
  if (attached) return;

  container.addEventListener("click", (event) => {
    if (!isActive()) return;

    const row = event.target.closest(".row");
    if (row) onRowClick(row);
  });

  attached = true;
}

export function attachPerRow(rowElements, onRowClick) {
  const startedAt = performance.now();

  for (const row of rowElements) {
    row.addEventListener("click", () => onRowClick(row));
  }

  lastAttach = {
    count: rowElements.length,
    duration: performance.now() - startedAt,
  };

  return lastAttach.count;
}

export function lastAttachReport() {
  return lastAttach;
}
