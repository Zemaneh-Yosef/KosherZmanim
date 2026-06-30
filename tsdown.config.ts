import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/kosher-zmanim.ts'],
  unbundle: false,
  minify: true,
  sourcemap: true,
  dts: true,
  format: "esm",
  deps: {
    alwaysBundle: [ /(.*)/ ]
  },
  outputOptions: {
    codeSplitting: false,
  }
})