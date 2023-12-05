import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: `src/kosher-zmanim.ts`,
    plugins: [esbuild({
      minify: true
    }), nodeResolve()],
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
    plugins: [dts(), nodeResolve()],
    output: {
      file: `dist/kosher-zmanim.esm.d.ts`,
      format: 'es',
    },
  }
]