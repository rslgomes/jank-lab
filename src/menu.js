const toggle = document.getElementById("menu-toggle");
const rows = document.getElementById("rows");
const wide = matchMedia("(min-width: 52rem)");

const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

function setOpen(open) {
  toggle.setAttribute("aria-expanded", String(open));
  rows.toggleAttribute("inert", open);
}

export function initMenu() {
  toggle.addEventListener("click", () => setOpen(!isOpen()));

  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  wide.addEventListener("change", (e) => e.matches && setOpen(false));
}
