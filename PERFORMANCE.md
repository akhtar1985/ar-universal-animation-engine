# Performance Requirements

- Use a shared requestAnimationFrame scheduler for active animations.
- Batch DOM reads before writes where possible.
- Avoid repeated layout-triggering reads during the same frame.
- Prefer transform and opacity for high-frequency motion when appropriate.
- Compose transform components without unexpectedly overwriting author styles.
- Pause or reduce work when the document is hidden.
- Clean up completed animations, listeners, observers, and references.
- Load advanced renderers/effects on demand.
- Avoid applying `will-change` indiscriminately or permanently.
- Provide reduced-motion behavior and sensible low-end-device fallbacks.
- Benchmark startup size, runtime frame cost, concurrent animations, and memory/lifecycle behavior.
- Report measured results rather than making unsupported performance claims.
