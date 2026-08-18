import { schedulingModes } from "./config/scheduling/index.js";

const CROWDED_DOM = 10_000;
const EXPENSIVE_GENERATION = 100_000;
const SCROLL_CEILING_ROWS = 700_000;

function rendersEveryRow(state) {
  return state.virtualization === "off";
}

function yieldsBetweenChunks(state) {
  const mode = schedulingModes[state.scheduling];

  return mode.chunked && state.chunkRows < state.rowCount;
}

function crowded(state) {
  return rendersEveryRow(state) && state.rowCount >= CROWDED_DOM;
}

const RULES = [
  {
    reason: "every row lands in the DOM at once, with no yielding between chunks",
    when: (state) => crowded(state) && !yieldsBetweenChunks(state),
  },
  {
    reason: "a click listener is attached to every row",
    when: (state) => crowded(state) && state.eventStrategy === "per_row",
  },
  {
    reason: "replaced rows are retained, so memory grows with every run",
    when: (state) => crowded(state) && state.memoryStrategy === "retain",
  },
  {
    reason: "nodes are appended one at a time into the live DOM",
    when: (state) => crowded(state) && state.buildStrategy === "create_element",
  },
  {
    reason: "faker builds every field and the cache is off",
    when: (state) =>
      state.dataSource === "faker" &&
      state.rowCount >= EXPENSIVE_GENERATION &&
      !state.cache,
  },
  {
    reason:
      "the spacer passes the browser scroll-height ceiling, so the last rows cannot be reached",
    when: (state) =>
      state.virtualization === "windowed" &&
      state.rowCount > SCROLL_CEILING_ROWS,
  },
];

export function warningsFor(state) {
  return RULES.filter((rule) => rule.when(state)).map((rule) => rule.reason);
}
