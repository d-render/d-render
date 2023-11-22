import series from './gulpfile'
import { watch } from 'gulp'
const entry = process.env.ENTRY_MODULE
if (!entry) {
  throw new Error('process.env.ENTRY_MODULE 必须为具体路径')
}
watch(`../../../packages/${entry}/src/**`, series)

export default series
