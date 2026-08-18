const MIN_UNITS = 3;
const MAX_UNITS = 40;
const SPEED = 40;
const DIVIDER_GLYPH = "•";

function createDivider() {
  const divider = document.createElement("span");
  divider.className = "super-header__divider";
  divider.setAttribute("aria-hidden", "true");
  divider.textContent = DIVIDER_GLYPH;
  return divider;
}

function cloneUnit(source) {
  const clone = source.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  return clone;
}

export function initMarquee(track) {
  const source = track.querySelector(".metrics--marquee");
  if (!source) return;

  const container = track.parentElement;
  track.append(createDivider());

  let unitWidth = 0;

  function unitCount() {
    return track.children.length / 2;
  }

  function ensureCoverage() {
    const containerWidth = container.getBoundingClientRect().width;
    if (containerWidth === 0) return;

    while (
      unitCount() < MIN_UNITS ||
      (track.scrollWidth < containerWidth * 2 && unitCount() < MAX_UNITS)
    ) {
      track.append(cloneUnit(source), createDivider());
    }

    unitWidth = track.children[0].offsetWidth + track.children[1].offsetWidth;
  }

  ensureCoverage();
  window.addEventListener("resize", ensureCoverage);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let startedAt = 0;

  function frame(now) {
    if (!startedAt) startedAt = now;

    if (unitWidth > 0) {
      const travelled = ((now - startedAt) / 1000) * SPEED;
      track.style.transform = `translateX(${-(travelled % unitWidth)}px)`;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
