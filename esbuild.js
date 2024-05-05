import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/kosher-zmanim.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome67', 'firefox68', 'safari14', 'edge19'],
  outfile: 'dist/kosher-zmanim.esm.js',
  format: "esm"
})