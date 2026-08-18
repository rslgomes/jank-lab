import { markOverflowBatched, markOverflowInterleaved } from "./methods.js";

export const layoutStrategies = {
  interleaved: {
    label: "Interleaved read/write",
    hint: "read a cell, write it, read the next — forces layout every row",
    run: markOverflowInterleaved,
  },
  batched: {
    label: "Batched read, then write",
    hint: "every read first, then every write — one layout pass",
    run: markOverflowBatched,
  },
};
