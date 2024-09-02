import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/kosher-zmanim.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome80', 'firefox76', 'safari14', 'edge80'],
  outfile: 'dist/kosher-zmanim.esm.js',
  format: "esm"
})