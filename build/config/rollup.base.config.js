import { defineConfig } from 'rollup'

export function getRollupBaseConfig (
  input,
  format,
  output,
  plugins,
  external
) {
  return defineConfig({
    input,
    plugins,
    output: {
      format,
      file: output,
      exports: format === 'cjs' ? 'named' : undefined
    },
    treeshake: { // 此处需要控制一番
      moduleSideEffects: 'no-external'
    },
    external
  })
}
