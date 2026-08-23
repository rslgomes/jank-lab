# Jank Lab

A rendering bench for large DOM lists. Every knob that affects how rows reach
the screen is exposed as an independent axis, so you can change exactly one
thing and watch what it costs.

No framework, no build step. Native ES modules served by a short Node
static server with SSE live reload.

```bash
npm start          # http://localhost:3000
npm test
```

## The idea

"This list is slow" can be multiple problems. From data generation, or the
insertion call, layout thrash, paint, or the main thread never yielding...
And fixing the wrong one feels like progress and changes nothing.

So each concern is a separate axis with its own implementations and the header
reports where the time actually went. Turn one dial, read the numbers and have
some fun looking at random jank at the screen :)

State is kept on url so every config is a link

## Axes

| Axis          | Options                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Data**      | `faker` (realistic, expensive) or `cheap` (synthetic); 100 → 1M rows; caching; country as text or flag image                          |
| **Insertion** | `innerHTML`, `insertAdjacentHTML`, Range fragment, `createElement` loop, `DocumentFragment`, `template` + `cloneNode`, node recycling |
| **Window**    | Render everything, windowed slice, or windowed with scaled scroll                                                                     |
| **Layout**    | Interleaved read/write, or batched read then write                                                                                    |
| **Paint**     | `contain: layout style paint`, `content-visibility: auto`, `will-change: transform`                                                   |
| **Time**      | Synchronous, `requestAnimationFrame`, `requestIdleCallback`, `scheduler.postTask`, `scheduler.yield`; chunk size                      |
| **Memory**    | Delegated vs per-row listeners; cleanup vs deliberately retaining detached rows                                                       |

Presets set every axis at once for a few known shapes — a baseline, one that
freezes the tab, one that stays responsive, one that survives a million rows.

## What gets measured

`generate` and `render` are wrapped with the User Timing API. `to paint` is a
double-`rAF` from the start of the run, because the last DOM call returning is
not the same as pixels landing. `style+layout` is the worst frame's style and
layout tail, read from `long-animation-frame` entries where the browser
supports it, `n/a` where it does not.

Runs are recorded automatically. The Runs dialog hides any config column that
is identical across every recorded run, so what remains is the axis under test
next to its numbers, with the fastest render marked.

Two bars during a render animate the same progress — one via `transform`, one
via `width`. When they drift apart, the main thread is blocked. That is the
whole thesis in one widget.

## Layout of the source

```
src/config/<axis>/   methods.js — implementations
                     index.js   — registry the settings UI reads
src/settings/        one module per panel
src/runs/            index.js is pure (store + column logic), dialog.js is DOM
src/metrics/         User Timing, frame observation, formatters
src/style/           cascade layers, CUBE-flavoured: 00_reset … 06_utilities
```

Domain modules never import application state — configuration is passed in or
pushed via a setter. A `render → state` cycle took the whole app down once.

## Roadmap

- **Update/mutate benchmark.** Insertion strategies are currently compared on
  cold build only. Re-rendering over an existing list is the more common real
  case, and the different results it generates are interesting to look at.

- **`node:test` coverage on the pure modules.**
