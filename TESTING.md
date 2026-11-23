# Testing Strategy

## Test layers
- Unit tests for interpolation, easing, timing, parsing, and state transitions.
- Integration tests for animation instances, renderers, timelines, and interactions.
- Browser tests for actual rendering and event behavior.
- Lifecycle tests for cleanup, cancellation, repeated initialization, and detached targets.
- Performance tests for many concurrent animations and large target sets.

## Required scenarios
- Multiple animations running concurrently.
- Pause, resume, reverse, restart, seek, cancel, and destroy.
- Zero duration, delay, repeat, and alternate behavior if supported.
- Invalid selectors and invalid configuration.
- Target removed from the document during animation.
- Repeated setup and teardown without listener/observer leaks.
- Resize and responsive configuration changes.
- Hidden tab pause/resume behavior.
- `prefers-reduced-motion` enabled and disabled.
- Scroll and pointer interactions without excessive work per frame.
- Browser fallback behavior for unsupported properties.

## Browser targets
Test current stable Chrome, Edge, Firefox, and Safari. Include Android Chrome and iOS Safari when test devices or services are available. Record actual tested versions; do not claim untested compatibility.

## Reporting
For every test run, record:
- command;
- environment/browser version;
- pass/fail summary;
- known failures;
- whether the failure is pre-existing or introduced by the change.
