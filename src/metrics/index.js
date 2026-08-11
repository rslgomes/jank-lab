import { formatCount, formatMs } from "../format.js";

export function measure(name, work) {
  const startMark = `${name}:start`;
  const endMark = `${name}:end`;

  performance.mark(startMark);
  const result = work();
  performance.mark(endMark);

  const { duration } = performance.measure(name, startMark, endMark);

  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);

  return { result, duration };
}

const formatters = {
  "row-count": formatCount,
  "dom-rows": formatCount,
  generate: formatMs,
  render: formatMs,
};

export function showMetrics(readings) {
  for (const [name, value] of Object.entries(readings)) {
    const text = formatters[name](value);

    for (const target of document.querySelectorAll(`[data-metric="${name}"]`)) {
      target.textContent = text;
    }
  }
}
