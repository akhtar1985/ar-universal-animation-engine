import { defineConfig } from 'rollup';

export default defineConfig([
  // Core ESM — tree-shakeable, no canvas/particles
  {
    input: 'src/index.js',
    output: {
      file: 'dist/uae.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    treeshake: true,
  },

  // UMD — single file for CDN / script tag usage
  {
    input: 'src/index.js',
    output: {
      file: 'dist/uae.umd.js',
      format: 'umd',
      name: 'UAE',
      sourcemap: true,
      exports: 'named',
    },
  },

  // Canvas + particles as a separate optional chunk
  {
    input: {
      'canvas': 'src/renderers/canvas/CanvasRenderer.js',
      'particles': 'src/effects/particles/ParticleSystem.js',
    },
    output: {
      dir: 'dist/optional',
      format: 'esm',
      sourcemap: true,
    },
  },
]);
