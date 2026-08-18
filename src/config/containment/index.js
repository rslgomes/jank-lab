export const containmentToggles = {
  contain: {
    label: "contain: layout style paint",
    hint: "isolate each row so its changes can't affect the rest of the page",
  },
  contentVisibility: {
    label: "content-visibility: auto",
    hint: "skip layout and paint for rows the browser knows are offscreen",
  },
  willChange: {
    label: "will-change: transform",
    hint: "hint the compositor before the scroll starts",
  },
};
