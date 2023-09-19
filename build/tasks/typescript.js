import { execSync } from 'child_process'
import { buildDirResolve } from '../utils/path.js'
import { rimrafSync } from 'rimraf'

const ENTRY_MODULE = process.env.ENTRY_MODULE
console.log('ENTRY_MODULE', ENTRY_MODULE)
if (!ENTRY_MODULE) process.exit(2)
const projectPath = `../packages/${ENTRY_MODULE}`
const bundlerPath = `${projectPath}/types`
rimrafSync(buildDirResolve(bundlerPath))
console.log('build', buildDirResolve(projectPath))
execSync('npx tsc', { cwd: buildDirResolve(projectPath), stdout: 'inherit' })
