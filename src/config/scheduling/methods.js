const hasIdleCallback = typeof requestIdleCallback === "function";

const hasPostTask =
  typeof scheduler !== "undefined" && typeof scheduler.postTask === "function";

const hasYield =
  typeof scheduler !== "undefined" && typeof scheduler.yield === "function";

export const synchronousMode = {
  label: "Synchronous",
  hint: "one blocking pass, no yielding",
  chunked: false,
  nextTick: null,
};

export const rafMode = {
  label: "requestAnimationFrame chunks",
  hint: "one chunk per animation frame",
  chunked: true,
  nextTick: () => new Promise((resolve) => requestAnimationFrame(resolve)),
};

export const idleMode = {
  label: "requestIdleCallback chunks",
  hint: hasIdleCallback
    ? "one chunk whenever the browser is idle"
    : "one chunk whenever the browser is idle (setTimeout fallback)",
  chunked: true,
  nextTick: hasIdleCallback
    ? () => new Promise((resolve) => requestIdleCallback(resolve))
    : () => new Promise((resolve) => setTimeout(resolve, 0)),
};

export const postTaskMode = {
  label: "scheduler.postTask chunks",
  hint: hasPostTask
    ? "one chunk per posted task, background priority"
    : "one chunk per posted task (setTimeout fallback)",
  chunked: true,
  nextTick: hasPostTask
    ? () => scheduler.postTask(() => {}, { priority: "background" })
    : () => new Promise((resolve) => setTimeout(resolve, 0)),
};

export const yieldMode = {
  label: "scheduler.yield chunks",
  hint: hasYield
    ? "cooperative yield, resumes with priority preserved"
    : "cooperative yield (setTimeout fallback)",
  chunked: true,
  nextTick: hasYield
    ? () => scheduler.yield()
    : () => new Promise((resolve) => setTimeout(resolve, 0)),
};
