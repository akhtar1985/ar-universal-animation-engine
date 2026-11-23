# Contributing and AI-Agent Working Rules

## Before changing code
- Read AGENTS.md and the relevant project documents.
- Inspect the current implementation and git status.
- Identify the smallest safe change.
- Explain the intended change and tests.

## Code quality
- Use readable, modular ES modules.
- Prefer small functions with clear responsibilities.
- Avoid hidden global state.
- Validate public inputs.
- Document public APIs and non-obvious behavior.
- Keep accessibility and reduced-motion support in mind.
- Add tests for bug fixes and new behavior.

## Dependency policy
Prefer zero runtime dependencies. Ask before adding a dependency and explain its purpose, size, maintenance, license, and why browser-native APIs are insufficient.

## Git and safety
Do not reset, force-push, delete branches, overwrite user work, or deploy without explicit approval. Preserve unrelated changes.
