import fg from 'fast-glob'
import { getRollupBaseConfig } from './rollup.base.config.js'
import { buildDirResolve } from '../utils/path.js'
import { join } from 'node:path'
import alias from '../rollup-plugins/rullip-plugin-alias.js'
export function getAllComponentDirs (inputDir, ignore = []) {
  return fg.sync(`${inputDir}/**/*.(jsx|js|mjs|vue)`, {
    ignore
  })
}

export function getRollupOptions (
  files,
  getConfig,
  inputDir,
  distEsm,
  plugins,
  externals
) {
  return files.reduce((acc, input) => {
    const output = input.replace(inputDir, '').replace(/\.(js(x)|vue)/, '.js')
    return [
      ...acc,
      getConfig(
        input,
        'esm',
        join(buildDirResolve(distEsm), output),
        [...plugins, alias({ rootDir: inputDir })],
        externals
      )
    ]
  }, [])
}

export function build (opts) {
  opts.inputDir = opts.inputDir.replace(/\\/g, '/')
  const components = getAllComponentDirs(opts.inputDir, opts.ignore)
  return getRollupOptions(
    components,
    getRollupBaseConfig,
    opts.inputDir,
    opts.distEsmPath,
    opts.plugins,
    opts.externals
  )
}
