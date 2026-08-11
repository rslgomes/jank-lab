import { buildStrategies } from "./index.js";
import { generateRows } from "../data/rows.js";

const SAMPLE_SIZE = 50;
const SAMPLE_OFFSET = 1;

function renderDetached(id, rows) {
  const host = document.createElement("div");

  buildStrategies[id].render(host, rows, SAMPLE_OFFSET);

  return host.innerHTML;
}

export function verifyStrategies() {
  const rows = generateRows(SAMPLE_SIZE, { source: "faker" });
  const [reference, ...others] = Object.keys(buildStrategies);
  const expected = renderDetached(reference, rows);

  return {
    total: Object.keys(buildStrategies).length,
    reference,
    mismatched: others.filter((id) => renderDetached(id, rows) !== expected),
  };
}
