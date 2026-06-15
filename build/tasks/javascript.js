import { readFileSync } from 'node:fs'
import { components } from '../config/common-config.js'
import { build } from '../config/rollup.config.js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import esbuild from 'rollup-plugin-esbuild'
import { buildDirResolve } from '../utils/path.js'
import { rimrafSync } from 'rimraf'
console.log('ENTRY_MODULE', process.env.ENTRY_MODULE)

const ENTRY_MODULE = process.env.ENTRY_MODULE
const projectPath = `../packages/${ENTRY_MODULE}`
const bundlerPath = `${projectPath}/esm`
const packagePath = `${projectPath}/package.json`
const srcPath = `${projectPath}/src`
const ignore = ['**/bak/**']
rimrafSync(buildDirResolve(bundlerPath))

const external = peerDepsExternal({
  packageJsonPath: buildDirResolve(packagePath)
})

const plugins = components.plugins.map((plugin) => {
  if (plugin.name !== 'esbuild' || ENTRY_MODULE !== 'd-render') {
    return plugin
  }
  const { version } = JSON.parse(readFileSync(buildDirResolve(packagePath), 'utf-8'))
  return esbuild({
    target: 'es6',
    define: {
      __D_RENDER_VERSION__: JSON.stringify(version)
    }
  })
})

export default build({
  inputDir: buildDirResolve(srcPath),
  distEsmPath: buildDirResolve(bundlerPath),
  ignore,
  plugins: [external, ...plugins],
  externals: components.external
})
