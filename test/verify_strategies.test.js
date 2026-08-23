import assert from "node:assert/strict";
import test from "node:test";

const SAMPLE_SIZE = 50;
const SAMPLE_OFFSET = 1;

const needsDom =
  typeof document === "undefined" &&
  "needs a DOM — run under jsdom to execute this";

test(
  "every insertion strategy emits identical DOM",
  { skip: needsDom },
  async () => {
    const { buildStrategies } = await import("../src/config/render/index.js");
    const { generateRows } = await import("../src/config/data/rows.js");

    const rows = generateRows(SAMPLE_SIZE, { source: "faker", cache: false });

    const markupOf = (id) => {
      const host = document.createElement("div");
      buildStrategies[id].render(host, rows, SAMPLE_OFFSET);
      return host.innerHTML;
    };

    const [reference, ...others] = Object.keys(buildStrategies);
    const expected = markupOf(reference);

    for (const id of others) {
      assert.equal(
        markupOf(id),
        expected,
        `${id} emits different markup than ${reference}`,
      );
    }
  },
);
