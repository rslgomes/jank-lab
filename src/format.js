export function formatCount(value) {
  if (value >= 1_000_000) return `${value / 1_000_000}M`;
  if (value >= 1_000) return `${value / 1_000}k`;
  return String(value);
}

export function formatBytes(value) {
  if (value === null || Number.isNaN(value)) return "n/a";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}MB`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}kB`;
  return `${value}B`;
}

export function formatMs(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`;
  if (value >= 10) return `${Math.round(value)}ms`;
  return `${value.toFixed(1)}ms`;
}

export function formatMsOrUnavailable(value) {
  return Number.isNaN(value) ? "n/a" : formatMs(value);
}
