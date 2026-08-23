import { formatCount, formatMs, formatMsOrUnavailable } from "../format.js";

const RUN_CAP = 20;

export const configColumns = [
  { key: "rows", label: "rows", format: formatCount },
  { key: "source", label: "source" },
  { key: "flags", label: "flags" },
  { key: "insertion", label: "insertion" },
  { key: "virtualization", label: "window" },
  { key: "layout", label: "layout" },
  { key: "paint", label: "paint" },
  { key: "scheduling", label: "scheduling" },
  { key: "events", label: "events" },
  { key: "memory", label: "memory" },
];

export const outcomeColumns = [
  { key: "domRows", label: "in dom", format: formatCount },
  { key: "generate", label: "generate", format: formatMs },
  { key: "render", label: "render", format: formatMs },
  { key: "styleLayout", label: "style+layout", format: formatMsOrUnavailable },
  { key: "painted", label: "to paint", format: formatMsOrUnavailable },
];

export function variesAcross(runs, key) {
  return runs.some((run) => run[key] !== runs[0][key]);
}

export function columnsFor(runs) {
  const config =
    runs.length <= 1
      ? configColumns
      : configColumns.filter((column) => variesAcross(runs, column.key));

  return [...config, ...outcomeColumns];
}

export function fastestRenderIndex(runs) {
  let best = -1;

  runs.forEach((run, index) => {
    if (best === -1 || run.render < runs[best].render) best = index;
  });

  return best;
}

const recorded = [];

export function recordRun(run) {
  recorded.push(run);
  if (recorded.length > RUN_CAP) recorded.shift();
}

export function recordedRuns() {
  return recorded;
}

export function clearRuns() {
  recorded.length = 0;
}
