## Why

The `vehicle-check` subject ships with seven schematic SVG diagrams. The engine-bay one in particular reads as boxes and does not help the learner find parts on a real car. The exam is on 2026-11-11, so real photos of the actual car type matter more than polish.

## What Changes

- Replace or supplement the schematic diagrams with real photographs (the learner's own photos of the driving school's car are preferred; freely licensed photos are the fallback).
- Number the parts on each photo the same way the diagrams do, so existing "which number is...?" questions keep working.
- Add a few new image questions where a photo helps (tyre sidewall with TWI, washer-fluid cap, MIN/MAX on real reservoirs, front and rear lights lit).
- Credit every third-party photo.

Out of scope: engine, schema or MCP changes; Belgian road-sign content (not part of the vehicle checks subject; propose separately if wanted).

## Capabilities

### Modified Capabilities
- `vehicle-check-subject`: image requirement now covers real photos and credits.

## Impact

- `public/images/vehicle-check/` gains photos (JPEG/WebP, max ~1200 px wide, compressed).
- `src/data/subjects/vehicle-check.json`: `image.src` and `alt` updated; some option labels and explanations may change if the layout of the real car differs from the diagram.
- `src/data/subjects/vehicle-check.test.ts`: extended to check credits.
