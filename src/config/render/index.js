import {
  withCreateElement,
  withFragment,
  withInnerHTML,
  withInsertAdjacentHtml,
  withRange,
  withRecycling,
  withTemplate,
} from "./methods.js";

export const buildStrategies = {
  inner_html: {
    label: "innerHTML",
    hint: "one string, native parser",
    render: withInnerHTML,
  },
  insert_adjacent_html: {
    label: "insertAdjacentHTML",
    hint: "same parser, no full replace",
    render: withInsertAdjacentHtml,
  },
  range: {
    label: "Range fragment",
    hint: "parse to fragment, insert once",
    render: withRange,
  },
  create_element: {
    label: "createElement loop",
    hint: "append each node live",
    render: withCreateElement,
  },
  fragment: {
    label: "DocumentFragment",
    hint: "build offline, insert once",
    render: withFragment,
  },
  template: {
    label: "template + cloneNode",
    hint: "clone a prebuilt row",
    render: withTemplate,
  },
  recycle: {
    label: "node recycling",
    hint: "reuse nodes, write changed text",
    render: withRecycling,
  },
};
