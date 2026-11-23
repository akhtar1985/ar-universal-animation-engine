# Universal Animation Engine — AI Agent Instructions

## Mission
Build a professional, independent, reusable Universal JavaScript Animation Engine (UAE) using browser-native technologies. This engine is a standalone product. A separate slider/carousel plugin may be built later on top of it, but slider functionality is out of scope for this project.

## Non-negotiable constraints
- Use vanilla JavaScript ES modules as the primary implementation.
- Do not use Swiper, Embla, Splide, GSAP, Anime.js, Motion, or another animation/slider engine as the underlying engine.
- Do not copy source code from existing libraries. Study public concepts and standards, then implement independently.
- Prefer browser-native APIs: requestAnimationFrame, Web Animations API where appropriate, CSS transforms, SVG, Canvas 2D, and optional WebGL modules.
- Do not add server requirements. The core engine must run in a browser without a backend.
- Do not deploy, publish, overwrite user data, delete existing files, or make live-site changes without explicit approval.
- Do not replace or recreate an existing project before inspecting it.
- Avoid unnecessary dependencies. Explain and justify every dependency before adding it.
- Keep the core lightweight; advanced renderers and effects should be modular and loadable on demand.

## Required agent workflow
1. Inspect the existing workspace, package files, source tree, scripts, and current git status before editing.
2. Report what exists, what is missing, and any risks. Do not assume the project is empty.
3. Read the project documents before implementing.
4. Work in small, reviewable phases. Do not jump ahead.
5. Before each phase, state the goal, files expected to change, and tests to run.
6. Preserve existing working code. Do not delete or rewrite files merely to make the structure match a template.
7. Implement real functionality; do not create fake controls, placeholder animations, or demo-only behavior presented as complete.
8. Run relevant tests and builds after changes. Report exact commands and outcomes.
9. Update documentation and FEATURE_STATUS.md with every completed feature.
10. Stop and ask before a destructive, costly, externally visible, or architecture-changing action.

## Product principles
- Beginners should be able to create useful animations with a few lines of code.
- Professionals should have precise control over timing, sequencing, rendering, interactions, and lifecycle.
- APIs should be predictable, composable, accessible, and documented.
- The same animation definitions should be reusable in code and in the visual studio.
- Reduced-motion preferences, cleanup, and performance are first-class requirements.

## First task
Do not begin large-scale implementation immediately. First inspect the workspace and prepare:
- current-project assessment;
- proposed architecture and module boundaries;
- API proposal with beginner and advanced examples;
- phased implementation plan;
- risks and open decisions;
- dependency proposal (prefer zero dependencies).

Wait for approval before substantial implementation.
