import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [json(), nodeResolve({ browser: true }), esbuild({
      minify: true,
      target: ['chrome67', 'firefox68', 'safari14', 'edge19']
    })],
    output: [
      {
        file: `dist/kosher-zmanim.esm.js`,
        format: 'esm',
        sourcemap: true
      },
    ]
  },
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [json(), nodeResolve(), typescript()],
    output: {
      file: `dist/kosher-zmanim.ignore.d.ts`,
    },
  }
]