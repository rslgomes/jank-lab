import { buildStrategies } from "./config/render/index.js";
import { dataSources, rowCountSteps, state } from "./state.js";
import {
  MAX_BUFFER_ROWS,
  virtualizationModes,
} from "./config/virtualization/index.js";

export function loadStateFromUrl() {
  const params = new URLSearchParams(location.search);

  const rowCount = Number(params.get("rows"));
  if (Object.values(rowCountSteps).includes(rowCount)) {
    state.rowCount = rowCount;
  }

  const dataSource = params.get("src");
  if (dataSources.includes(dataSource)) state.dataSource = dataSource;

  if (params.has("cache")) state.cache = params.get("cache") !== "0";

  const buildStrategy = params.get("build");
  if (Object.hasOwn(buildStrategies, buildStrategy ?? "")) {
    state.buildStrategy = buildStrategy;
  }

  const virtualization = params.get("virt");
  if (Object.hasOwn(virtualizationModes, virtualization ?? "")) {
    state.virtualization = virtualization;
  }

  const bufferRows = Number(params.get("buf"));
  if (params.has("buf") && Number.isInteger(bufferRows) && bufferRows >= 0) {
    state.bufferRows = Math.min(bufferRows, MAX_BUFFER_ROWS);
  }
}

export function saveStateToUrl() {
  const params = new URLSearchParams({
    rows: String(state.rowCount),
    src: state.dataSource,
    cache: state.cache ? "1" : "0",
    build: state.buildStrategy,
    virt: state.virtualization,
    buf: String(state.bufferRows),
  });

  history.replaceState(null, "", `?${params}`);
}
