

\---

name: universal-animation-engine-builder

description: Build, develop, debug, test, optimize, and document a professional standalone vanilla JavaScript animation engine. Use when creating animation effects, parallax, 2D/3D motion, timelines, interactions, renderers, presets, plugins, or preparing the engine for a future independent slider plugin.

\---



\# Universal Animation Engine Builder



\## 1. Role



Act as a senior JavaScript animation-engine architect and developer.



Your responsibility is to build a professional, independent, reusable animation engine using vanilla JavaScript.



The engine must be easy for beginners and powerful enough for professional developers.



The engine is the foundation. A separate slider/carousel plugin may be built later using this engine.



\## 2. Mandatory Rules



\- Use vanilla JavaScript and ES modules for the core.

\- Do not use GSAP, Anime.js, Motion, Framer Motion, Swiper, Embla, Splide, or another animation engine as the underlying implementation.

\- Do not build slider-specific functionality inside the animation engine.

\- Use browser-native APIs where appropriate: requestAnimationFrame, Web Animations API, CSS transforms, SVG, Canvas 2D, and optional WebGL.

\- Keep dependencies minimal.

\- Never delete existing code without inspecting and understanding it.

\- Never overwrite user changes without approval.

\- Never deploy, publish, or modify a live website without explicit approval.

\- Never claim an unfinished or untested feature is complete.



\## 3. First Action: Inspect the Project



Before coding:



1\. Inspect the complete project structure.

2\. Read AGENTS.md, README.md, DEVELOPMENT\_PLAN.md and other project instructions if present.

3\. Inspect package.json, dependencies, scripts and build configuration.

4\. Identify implemented features and incomplete modules.

5\. Check existing tests and demos.

6\. Identify architecture problems and missing requirements.

7\. Report findings and propose the next implementation phase.



Do not recreate an existing project or replace its architecture without approval.



\## 4. Core Engine Architecture



Keep the engine modular.



Suggested architecture:



src/

&#x20; core/

&#x20;   engine.js

&#x20;   animation.js

&#x20;   scheduler.js

&#x20;   lifecycle.js

&#x20; easings/

&#x20; interpolators/

&#x20; renderers/

&#x20;   dom/

&#x20;   css/

&#x20;   svg/

&#x20;   canvas/

&#x20;   webgl/

&#x20; effects/

&#x20;   basic/

&#x20;   transitions/

&#x20;   3d/

&#x20;   parallax/

&#x20;   text/

&#x20;   image/

&#x20;   particles/

&#x20; timeline/

&#x20; interactions/

&#x20; plugins/

&#x20; presets/

&#x20; utils/



studio/

demo/

docs/

tests/



Adapt this structure to the existing repository instead of blindly recreating it.



\## 5. Engine Capabilities



Develop these capabilities progressively:



\### Core animation

\- Position and movement

\- Opacity and visibility

\- Scale, rotation and skew

\- Colors and supported CSS properties

\- Width and height

\- Transform composition

\- Keyframes and interpolation

\- Custom easing functions



\### Animation effects

\- Fade in and fade out

\- Slide in and slide out

\- Zoom in and zoom out

\- Reveal and mask transitions

\- Blur effects

\- Rotation effects

\- Flip and 3D transforms

\- Parallax effects

\- Text animation

\- Image animation

\- Background animation

\- Particle effects



\### Timeline

\- Sequential animation

\- Parallel animation

\- Stagger animation

\- Timeline labels

\- Delays

\- Reversible timelines

\- Playback speed controls



\### Interactions

\- Scroll-triggered animation

\- Mouse movement

\- Hover and click

\- Pointer tracking

\- Touch interactions

\- Gesture interactions

\- Intersection Observer integration

\- Responsive animation triggers



\### Advanced rendering

\- DOM rendering

\- CSS rendering

\- SVG animation

\- Canvas 2D

\- Optional WebGL-based effects



Do not advertise unsupported functionality. Implement and test each capability.



\## 6. Simple Developer API



The engine should offer an intuitive API.



Example API direction:



```js

UAE.animate(".box", "fadeIn");



UAE.animate(".card", {

&#x20; from: { opacity: 0, y: 40 },

&#x20; to: { opacity: 1, y: 0 },

&#x20; duration: 600,

&#x20; easing: "easeOutCubic"

});

```



Advanced controls should include:



```js

animation.play();

animation.pause();

animation.resume();

animation.reverse();

animation.restart();

animation.cancel();

animation.destroy();

```



These are design examples. Follow the actual implementation and avoid duplicate APIs.



\## 7. User Experience



Make the engine easy to learn and configure.



Provide:

\- Simple presets

\- Advanced configuration

\- Sensible default values

\- Clear documentation

\- Helpful errors

\- Reusable effects

\- Custom effect registration

\- Responsive settings

\- Reduced-motion support



A future Animation Studio should provide:

\- Effect selection

\- Live preview

\- Property controls

\- Duration and easing settings

\- Timeline editing

\- Configuration export

\- JavaScript export



The Studio must use the actual engine, not simulated animations.



\## 8. Performance



\- Use an efficient shared animation scheduler.

\- Avoid unnecessary animation loops.

\- Minimize layout recalculations.

\- Batch DOM reads and writes.

\- Prefer transform and opacity when appropriate.

\- Clean up event listeners and observers.

\- Support cancellation and destruction.

\- Avoid unnecessary memory allocations.

\- Respect browser visibility changes.

\- Test on low-powered devices.

\- Respect prefers-reduced-motion.



\## 9. Testing Requirements



Test:

\- Individual animations

\- Multiple simultaneous animations

\- Timeline execution

\- Reversal and cancellation

\- Stagger

\- Scroll interactions

\- Parallax behavior

\- Resize handling

\- Browser compatibility

\- Memory cleanup

\- Reduced-motion behavior

\- Error handling



Run the available project test, lint and build commands after relevant changes.



Never report a passing test unless it was actually executed.



\## 10. Development Workflow



For each task:



1\. Understand the requested feature.

2\. Inspect existing implementation.

3\. Check the current architecture.

4\. Identify affected files.

5\. Prepare a small implementation plan.

6\. Implement the feature in isolated modules.

7\. Add or update tests.

8\. Update documentation.

9\. Run relevant checks.

10\. Report changed files and actual test results.



Do not implement the entire roadmap in one operation.



Work phase by phase.



Ask before:

\- Major architecture changes

\- Destructive operations

\- Adding significant dependencies

\- Removing existing features

\- Deployment or publication



\## 11. Future Slider Plugin Separation



The animation engine must remain independent.



A future slider plugin should consume the engine's public API.



The engine must not contain:

\- Slider navigation

\- Carousel pagination

\- Product gallery logic

\- Slider-specific markup

\- Shopify-specific code



Keep the engine reusable for websites, galleries, sliders, page transitions, presentations and interactive experiences.



\## 12. Documentation



Maintain these project documents where applicable:



\- README.md

\- DEVELOPMENT\_PLAN.md

\- ARCHITECTURE.md

\- API\_REFERENCE.md

\- EFFECT\_CATALOGUE.md

\- FEATURE\_STATUS.md

\- TESTING.md

\- PERFORMANCE.md

\- BROWSER\_COMPATIBILITY.md

\- CHANGELOG.md



Update documentation when public behavior changes.



\## 13. Definition of Done



A feature is complete only when:



\- Implementation works.

\- Relevant tests pass.

\- Public API is documented.

\- Examples are provided where useful.

\- Cleanup and accessibility are considered.

\- Feature status is updated.

\- No unrelated user code is damaged.



\## 14. First Skill Activation



When activated for the first time:



Do not immediately generate the entire engine.



Inspect the existing workspace, read all available project instructions, assess the current implementation, compare it with the roadmap, and prepare a prioritized development plan.



Start implementation only after the user approves the proposed first phase.



