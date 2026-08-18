import { formatMs } from "./format.js";

const overlay = document.getElementById("loading");
const log = document.getElementById("loading-log");
const scroller = document.getElementById("rows-list");

const YIELD_TIMEOUT = 100;

let currentStep = null;
let stepStartedAt = 0;
let yieldedMs = 0;
let fadeTimer = 0;

function nextPaint() {
  return new Promise((resolve) => {
    let timer = 0;

    const settle = () => {
      clearTimeout(timer);
      resolve();
    };

    timer = setTimeout(settle, YIELD_TIMEOUT);
    requestAnimationFrame(settle);
  });
}

function finishStep() {
  if (!currentStep) return;

  const elapsed = performance.now() - stepStartedAt;
  currentStep.querySelector(".loading__time").textContent = formatMs(elapsed);
  currentStep.dataset.state = "done";
  currentStep = null;
}

function hide() {
  if (overlay.dataset.state !== "fading") return;
  overlay.hidden = true;
}

export function beginRun() {
  clearTimeout(fadeTimer);
  log.replaceChildren();
  currentStep = null;
  yieldedMs = 0;
  overlay.hidden = false;
  overlay.dataset.state = "running";
  scroller.inert = true;
}

export async function startStep(name) {
  finishStep();

  const step = document.createElement("li");
  step.className = "loading__step";
  step.dataset.state = "running";

  const label = document.createElement("span");
  label.textContent = name;

  const time = document.createElement("span");
  time.className = "loading__time";

  step.append(label, time);
  log.append(step);
  currentStep = step;

  const yieldedAt = performance.now();
  await nextPaint();
  yieldedMs += performance.now() - yieldedAt;

  stepStartedAt = performance.now();
}

export function endRun() {
  finishStep();
  scroller.inert = false;

  overlay.dataset.state = "fading";

  const fadeMs =
    parseFloat(getComputedStyle(overlay).transitionDuration) * 1000;

  fadeTimer = setTimeout(hide, fadeMs);
}

export function yieldedSoFar() {
  return yieldedMs;
}
