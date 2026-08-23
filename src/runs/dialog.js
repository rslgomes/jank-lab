import {
  clearRuns,
  columnsFor,
  configColumns,
  fastestRenderIndex,
  recordRun,
  recordedRuns,
} from "./index.js";

function cell(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

export function initRuns({ beforeOpen } = {}) {
  const dialog = document.getElementById("runs-dialog");
  const toggle = document.getElementById("runs-toggle");
  const holder = document.getElementById("runs-table");
  const readout = document.getElementById("runs-readout");
  const clearButton = document.getElementById("runs-clear");
  const closeButton = document.getElementById("runs-close");

  function buildTable(runs, columns) {
    const head = document.createElement("tr");
    head.append(cell("th", "#"));
    for (const column of columns) head.append(cell("th", column.label));

    const body = document.createElement("tbody");
    const best = fastestRenderIndex(runs);

    runs.forEach((run, index) => {
      const row = document.createElement("tr");
      if (index === best) row.dataset.best = "1";

      row.append(cell("th", String(index + 1)));

      for (const column of columns) {
        const format = column.format ?? String;
        row.append(cell("td", format(run[column.key])));
      }

      body.append(row);
    });

    const header = document.createElement("thead");
    header.append(head);

    const table = document.createElement("table");
    table.className = "runs__table";
    table.append(header, body);

    return table;
  }

  function draw() {
    const runs = recordedRuns();
    toggle.dataset.count = String(runs.length);

    if (runs.length === 0) {
      holder.replaceChildren();
      readout.textContent = "No runs yet. Every render records one.";
      return;
    }

    const columns = columnsFor(runs);
    holder.replaceChildren(buildTable(runs, columns));

    const shown = new Set(columns.map((column) => column.key));
    const hidden = configColumns.filter((column) => !shown.has(column.key));

    readout.textContent = hidden.length
      ? `${runs.length} runs. Identical across every run, so hidden: ${hidden
          .map((column) => column.label)
          .join(", ")}.`
      : `${runs.length} run${runs.length === 1 ? "" : "s"}.`;
  }

  toggle.addEventListener("click", () => {
    beforeOpen?.();
    draw();
    dialog.showModal();
  });

  closeButton.addEventListener("click", () => dialog.close());

  clearButton.addEventListener("click", () => {
    clearRuns();
    draw();
  });

  draw();

  return {
    record(run) {
      recordRun(run);
      draw();
    },
  };
}
