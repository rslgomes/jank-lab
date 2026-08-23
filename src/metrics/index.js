import { formatCount, formatMs, formatMsOrUnavailable } from "../format.js";

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

export async function measureAsync(name, work) {
  const startMark = `${name}:start`;
  const endMark = `${name}:end`;

  performance.mark(startMark);
  const result = await work();
  performance.mark(endMark);

  const { duration } = performance.measure(name, startMark, endMark);

  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);

  return { result, duration };
}

let framesObserved = false;
let capturingFrames = false;
let worstStyleAndLayout = 0;

const FRAME_ENTRY_TYPE = "long-animation-frame";

export function observeFrames() {
  if (!PerformanceObserver.supportedEntryTypes?.includes(FRAME_ENTRY_TYPE)) {
    framesObserved = false;
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      if (!capturingFrames) return;

      for (const entry of list.getEntries()) {
        if (!entry.styleAndLayoutStart) continue;

        const frameEnd = entry.startTime + entry.duration;
        worstStyleAndLayout = Math.max(
          worstStyleAndLayout,
          frameEnd - entry.styleAndLayoutStart,
        );
      }
    });

    observer.observe({ type: FRAME_ENTRY_TYPE });
    framesObserved = true;
  } catch {
    framesObserved = false;
  }
}

export function beginFrameCapture() {
  capturingFrames = true;
  worstStyleAndLayout = 0;
}

export function endFrameCapture() {
  return new Promise((resolve) => {
    setTimeout(() => {
      capturingFrames = false;
      resolve(framesObserved ? worstStyleAndLayout : Number.NaN);
    });
  });
}

const PAINT_TIMEOUT = 1000;

export function timeToPaint(startedAt) {
  return new Promise((resolve) => {
    const giveUp = setTimeout(() => resolve(Number.NaN), PAINT_TIMEOUT);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clearTimeout(giveUp);
        resolve(performance.now() - startedAt);
      });
    });
  });
}

const formatters = {
  "row-count": formatCount,
  "dom-rows": formatCount,
  generate: formatMs,
  render: formatMs,
  painted: formatMsOrUnavailable,
  "style-layout": formatMsOrUnavailable,
};

export function showMetrics(readings) {
  for (const [name, value] of Object.entries(readings)) {
    const text = formatters[name](value);

    for (const target of document.querySelectorAll(`[data-metric="${name}"]`)) {
      target.textContent = text;
    }
  }
}
