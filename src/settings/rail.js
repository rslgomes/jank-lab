const CENTRE_BAND = "-50% 0px -50% 0px";

export function initRail() {
  const scroller = document.querySelector(".settings__scroller");
  const links = new Map();

  for (const link of document.querySelectorAll(
    ".settings__rail a[href^='#']",
  )) {
    links.set(link.getAttribute("href").slice(1), link);
  }

  function markCurrent(sectionId) {
    for (const [id, link] of links) {
      if (id === sectionId) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      }
    },
    { root: scroller, rootMargin: CENTRE_BAND },
  );

  for (const section of scroller.querySelectorAll(".settings__section")) {
    if (links.has(section.id)) observer.observe(section);
  }
}
