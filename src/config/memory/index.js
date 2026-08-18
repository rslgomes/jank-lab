export const memoryStrategies = {
  cleanup: {
    label: "Cleanup",
    hint: "old rows are discarded, nothing holds a reference",
  },
  retain: {
    label: "Retain detached rows",
    hint: "old rows are kept off-DOM — a deliberate leak",
  },
};

const retained = [];

export function beforeReplace(rowElements, strategyId) {
  if (strategyId === "retain") retained.push(...rowElements);
}

export function retainedCount() {
  return retained.length;
}

export function clearRetained() {
  retained.length = 0;
}

export function heapUsage() {
  return performance.memory ? performance.memory.usedJSHeapSize : null;
}
