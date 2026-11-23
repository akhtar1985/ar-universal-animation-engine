# Architecture Proposal

This is a proposal to validate after inspecting the real workspace. Do not force the repository into this layout if a sound existing architecture already exists.

## Layers

### 1. Public API
Small, stable entry points for simple animations, advanced keyframes, timelines, presets, and interactions.

### 2. Core
Owns animation instances, targets, state transitions, options, events, and lifecycle. It should not contain effect-specific rendering code.

### 3. Scheduler
A shared frame scheduler coordinates active animations. It handles elapsed time, visibility changes, and efficient update batching.

### 4. Interpolation and easing
Pure functions for interpolating values and mapping progress through easing curves. Keep them independently testable.

### 5. Renderers
- DOM/CSS renderer
- SVG renderer
- Canvas 2D renderer
- Optional WebGL renderer, only if a real use case justifies the complexity

### 6. Effects
Effects are modular definitions that describe values and rendering behavior. Categories should be loadable independently.

### 7. Timeline
Coordinates multiple animations, offsets, sequences, parallel groups, labels, and stagger.

### 8. Interactions
Connects user/browser events to animation playback without coupling event listeners to the core scheduler.

### 9. Presets and plugins
Presets are convenience configurations. Plugins extend the engine through a documented, validated contract.

### 10. Studio
A separate UI application that configures and previews animations using the same public engine API. It must not contain a second, fake animation implementation.

## Design rules
- Keep the core independent of the Studio.
- Avoid circular dependencies.
- Separate public API from internal implementation.
- Make cleanup explicit and reliable.
- Prefer composable primitives over a giant monolithic effect module.
- Validate options at API boundaries.
- Do not mutate caller-owned configuration objects.
- Keep optional renderers and heavy effects out of the default bundle where possible.
- Document browser support and fallbacks.

## Important technical questions to resolve
- Which CSS properties are safe and useful for the initial DOM renderer?
- How should transform components coexist with transforms authored by page CSS?
- What is the public keyframe/value syntax?
- How should animation cancellation and style restoration work?
- Which browsers are in the supported baseline?
- Is WebGL required for the first major release, or should it remain an optional future renderer?
