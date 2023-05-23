import { components } from '../config/common-config.js'
import { build } from '../config/rollup.config.js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { buildDirResolve } from '../utils/path.js'
import { rimrafSync } from 'rimraf'

console.log('ENTRY_MODULE', process.env.ENTRY_MODULE);

const ENTRY_MODULE = process.env.ENTRY_MODULE
const projectPath = `../packages/${ENTRY_MODULE}`
const bundlerPath = `${projectPath}/esm`
const packagePath = `${projectPath}/package.json`
const srcPath = `${projectPath}/src`
const ignore = []
rimrafSync(buildDirResolve(bundlerPath))

const external = peerDepsExternal({
  packageJsonPath: buildDirResolve(packagePath)
})

export default build({
  inputDir: buildDirResolve(srcPath),
  distEsmPath: buildDirResolve(bundlerPath),
  ignore,
  plugins: [external, ...components.plugins],
  externals: components.external
})
