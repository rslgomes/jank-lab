import { windowedListCore } from "./core.js";

export function fullList({ surface }) {
  return {
    render(rows, strategy) {
      surface.replaceChildren();
      strategy(surface, rows, 0);

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
