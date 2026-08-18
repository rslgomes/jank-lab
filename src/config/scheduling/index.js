import {
  idleMode,
  postTaskMode,
  rafMode,
  synchronousMode,
  yieldMode,
} from "./methods.js";

export const schedulingModes = {
  synchronous: synchronousMode,
  raf: rafMode,
  idle: idleMode,
  post_task: postTaskMode,
  yield: yieldMode,
};

export const MIN_CHUNK_ROWS = 10;
export const MAX_CHUNK_ROWS = 5000;
