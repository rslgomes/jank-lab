import { fullList, windowedList, windowedScaledList } from "./methods.js";

export const virtualizationModes = {
  off: {
    label: "Render everything",
    hint: "every row lives in the DOM",
    create: fullList,
  },
  windowed: {
    label: "Windowed slice",
    hint: "visible rows plus a buffer",
    create: windowedList,
  },
  windowed_scaled: {
    label: "Windowed, scaled scroll",
    hint: "spacer capped, scroll remapped — unbounded rows",
    create: windowedScaledList,
  },
};

export const MAX_BUFFER_ROWS = 40;
