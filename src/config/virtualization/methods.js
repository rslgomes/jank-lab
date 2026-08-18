import { schedulingModes } from "../scheduling/index.js";
import { windowedListCore } from "./core.js";

export function fullList({ surface }) {
  return {
    async render(rows, strategy, options = {}) {
      const { scheduling = "synchronous", chunkRows = rows.length } = options;
      const mode = schedulingModes[scheduling];

      surface.replaceChildren();

      if (!mode.chunked || chunkRows >= rows.length) {
        strategy(surface, rows, 0);

        return rows.length;
      }

      for (let start = 0; start < rows.length; start += chunkRows) {
        const chunk = rows.slice(start, start + chunkRows);
        const host = document.createElement("div");

        strategy(host, chunk, start);
        surface.append(...host.children);

        if (start + chunkRows < rows.length) await mode.nextTick();
      }

      return rows.length;
    },

    destroy() {
      surface.replaceChildren();
      surface.style.removeProperty("height");
    },
  };
}

export function windowedList(options) {
  return windowedListCore({
    ...options,
    spacerHeight: (totalHeight) => totalHeight,
    virtualTop: (scrollTop) => scrollTop,
  });
}

const SAFE_SPACER_HEIGHT = 10_000_000;

export function windowedScaledList(options) {
  return windowedListCore({
    ...options,
    spacerHeight: (totalHeight) => Math.min(totalHeight, SAFE_SPACER_HEIGHT),

    virtualTop: (scrollTop, totalHeight, spacer, scroller) => {
      const maxScroll = spacer - scroller.clientHeight;
      const maxVirtual = totalHeight - scroller.clientHeight;

      if (maxScroll <= 0 || maxVirtual <= 0) return scrollTop;

      return (scrollTop / maxScroll) * maxVirtual;
    },
  });
}
