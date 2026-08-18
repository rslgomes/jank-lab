import { createRowElement } from "../render/row_shape.js";

const FALLBACK_ROW_HEIGHT = 48;

function measureRowHeight(surface) {
  const probe = createRowElement();
  probe.style.visibility = "hidden";
  surface.append(probe);

  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height > 0 ? height : FALLBACK_ROW_HEIGHT;
}

export function windowedListCore({
  scroller,
  surface,
  bufferRows,
  spacerHeight,
  virtualTop,
}) {
  const viewport = document.createElement("div");
  viewport.className = "rows__viewport";

  let rows = [];
  let strategy = null;
  let rowHeight = 0;
  let totalHeight = 0;
  let spacer = 0;
  let renderedFirst = -1;
  let renderedLast = -1;

  function visibleSlice() {
    const top = virtualTop(scroller.scrollTop, totalHeight, spacer, scroller);
    const firstVisible = Math.floor(top / rowHeight);
    const visibleCount = Math.ceil(scroller.clientHeight / rowHeight);

    return [
      Math.max(0, firstVisible - bufferRows),
      Math.min(rows.length, firstVisible + visibleCount + bufferRows),
      top,
    ];
  }

  function paint() {
    if (!strategy || rows.length === 0) return 0;

    const [first, last, top] = visibleSlice();

    if (first !== renderedFirst || last !== renderedLast) {
      strategy(viewport, rows.slice(first, last), first);
      renderedFirst = first;
      renderedLast = last;
    }

    const visualOffset = scroller.scrollTop - (top - first * rowHeight);
    viewport.style.transform = `translateY(${visualOffset}px)`;

    return last - first;
  }

  scroller.addEventListener("scroll", paint, { passive: true });

  return {
    render(nextRows, nextStrategy) {
      rowHeight = measureRowHeight(surface);
      rows = nextRows;
      strategy = nextStrategy;
      totalHeight = rows.length * rowHeight;
      spacer = spacerHeight(totalHeight);
      renderedFirst = -1;
      renderedLast = -1;

      if (viewport.parentNode !== surface) surface.replaceChildren(viewport);
      surface.style.height = `${spacer}px`;

      return paint();
    },

    destroy() {
      scroller.removeEventListener("scroll", paint);
      viewport.remove();
      surface.replaceChildren();
      surface.style.removeProperty("height");
    },
  };
}
