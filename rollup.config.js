import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [nodeResolve({ browser: true }), esbuild({
      minify: true
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
    plugins: [nodeResolve(), typescript()],
    output: {
      file: `dist/kosher-zmanim.ignore.d.ts`,
    },
  }
]