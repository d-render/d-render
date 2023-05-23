import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))
export const buildDirResolve = (p) => {
  return resolve(__dirname, '..', p)
}
