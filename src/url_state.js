import { buildStrategies } from "./config/render/index.js";
import { dataSources, rowCountSteps, state } from "./state.js";
import { eventStrategies } from "./config/events/index.js";
import { layoutStrategies } from "./config/layout/index.js";
import {
  MAX_CHUNK_ROWS,
  MIN_CHUNK_ROWS,
  schedulingModes,
} from "./config/scheduling/index.js";
import { memoryStrategies } from "./config/memory/index.js";
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

  const layoutStrategy = params.get("layout");
  if (Object.hasOwn(layoutStrategies, layoutStrategy ?? "")) {
    state.layoutStrategy = layoutStrategy;
  }

  const paint = params.get("paint");
  if (paint !== null) {
    const flags = new Set(paint.split(",").filter(Boolean));

    for (const key of Object.keys(state.containment)) {
      state.containment[key] = flags.has(key);
    }
  }

  const scheduling = params.get("sched");
  if (Object.hasOwn(schedulingModes, scheduling ?? "")) {
    state.scheduling = scheduling;
  }

  const chunkRows = Number(params.get("chunk"));
  if (params.has("chunk") && Number.isInteger(chunkRows) && chunkRows > 0) {
    state.chunkRows = Math.min(
      Math.max(chunkRows, MIN_CHUNK_ROWS),
      MAX_CHUNK_ROWS,
    );
  }

  const eventStrategy = params.get("events");
  if (Object.hasOwn(eventStrategies, eventStrategy ?? "")) {
    state.eventStrategy = eventStrategy;
  }

  const memoryStrategy = params.get("mem");
  if (Object.hasOwn(memoryStrategies, memoryStrategy ?? "")) {
    state.memoryStrategy = memoryStrategy;
  }
}

export function saveStateToUrl() {
  const paint = Object.entries(state.containment)
    .filter(([, on]) => on)
    .map(([key]) => key)
    .join(",");

  const params = new URLSearchParams({
    rows: String(state.rowCount),
    src: state.dataSource,
    cache: state.cache ? "1" : "0",
    build: state.buildStrategy,
    virt: state.virtualization,
    buf: String(state.bufferRows),
    layout: state.layoutStrategy,
    paint,
    sched: state.scheduling,
    chunk: String(state.chunkRows),
    events: state.eventStrategy,
    mem: state.memoryStrategy,
  });

  history.replaceState(null, "", `?${params}`);
}
