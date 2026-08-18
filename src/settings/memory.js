import { formatBytes, formatCount, formatMs } from "../format.js";
import {
  clearRetained,
  heapUsage,
  memoryStrategies,
  retainedCount,
} from "../config/memory/index.js";
import { eventStrategies } from "../config/events/index.js";
import { lastAttachReport } from "../config/events/methods.js";
import { renderChoices, syncChoices } from "./controls.js";
import { state } from "../state.js";

export function initMemorySettings(onChange) {
  const eventField = document.getElementById("event-strategy");
  const memoryField = document.getElementById("memory-strategy");
  const clearButton = document.getElementById("clear-retained");
  const readout = document.getElementById("memory-readout");

  function report() {
    const retained = retainedCount();
    const attach = lastAttachReport();
    const heap = heapUsage();

    const attachNote =
      state.eventStrategy === "per_row"
        ? `${formatCount(attach.count)} listeners attached in ${formatMs(attach.duration)}`
        : "0 listeners attached — one delegated handler covers every row";

    readout.textContent = `${attachNote}. Retained: ${formatCount(retained)} rows. Heap: ${formatBytes(heap)}${heap === null ? " (chromium only)" : ""}.`;
  }

  renderChoices(
    eventField,
    "event-strategy",
    Object.entries(eventStrategies),
    state.eventStrategy,
    (value) => {
      state.eventStrategy = value;
      onChange();
      report();
    },
  );

  renderChoices(
    memoryField,
    "memory-strategy",
    Object.entries(memoryStrategies),
    state.memoryStrategy,
    (value) => {
      state.memoryStrategy = value;
      onChange();
    },
  );

  function sync() {
    syncChoices(eventField, "event-strategy", state.eventStrategy);
    syncChoices(memoryField, "memory-strategy", state.memoryStrategy);
    report();
  }

  clearButton.addEventListener("click", () => {
    clearRetained();
    report();
  });

  report();

  return { sync, report };
}
