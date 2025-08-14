import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/kosher-zmanim.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome80', 'firefox76', 'safari14', 'edge80'],
  dts: true,
  format: "esm",
  noExternal: [ /(.*)/ ]
})