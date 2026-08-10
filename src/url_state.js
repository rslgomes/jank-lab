import { buildStrategies } from "./render/index.js";
import { dataSources, rowCountSteps, state } from "./state.js";

export function loadStateFromUrl() {
  const params = new URLSearchParams(location.search);

  const rowCount = Number(params.get("rows"));
  if (Object.values(rowCountSteps).includes(rowCount)) {
    state.rowCount = rowCount;
  }

  const dataSource = params.get("src");
  if (dataSources.includes(dataSource)) state.dataSource = dataSource;

  const buildStrategy = params.get("build");
  if (Object.hasOwn(buildStrategies, buildStrategy ?? "")) {
    state.buildStrategy = buildStrategy;
  }
}

export function saveStateToUrl() {
  const params = new URLSearchParams({
    rows: String(state.rowCount),
    src: state.dataSource,
    build: state.buildStrategy,
  });

  history.replaceState(null, "", `?${params}`);
}
