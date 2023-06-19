import { getParamsFromCommand } from '../utils/tool.js'
import fglob from 'fast-glob'
import extra from 'fs-extra'
import chalk from 'chalk'
import { buildDirResolve } from '../utils/path.js'
import { rimrafSync } from 'rimraf'
const { entry = process.env.ENTRY_MODULE } = getParamsFromCommand(process.argv)
if (!entry) process.exit(2)
const projectPath = `../packages/${entry}`
rimrafSync(buildDirResolve(`${projectPath}/types`))
const projectSchemePath = buildDirResolve(`${projectPath}/src/**/component.scheme.js`)
const outputFileSync = extra.outputFileSync
console.log('projectSchemePath', projectSchemePath)
const componentSchemes = fglob.sync(projectSchemePath)

const getTsTypeByType = (type) => {
  if (Array.isArray(type)) {
    return type.map(t => getTsTypeByType(t)).join('|')
  }
  if (type === Object) return 'import(\'@d-render/shared\').IAnyObject'
  if (type === String) return 'string'
  if (type === Boolean) return 'boolean'
  if (type === Number) return 'number'
  if (type === Function) return 'function():void'
  if (type === Array) return 'Array<any>'
}

const componentDTs = {}
const genComponentsDTs = () => {
  return Promise.all(componentSchemes.map(dir => {
    // const componentScheme = require(dir)/**/
    return new Promise((resolve) => {
      import(dir).then((res) => {
        const { componentScheme } = res.default
        const propsScheme = componentScheme.propsScheme
        const propsString = Object.keys(propsScheme).reduce((acc, key, i) => {
          const config = propsScheme[key]
          const type = config.tsType || getTsTypeByType(config.type)
          const isRequired = config.required === true
          acc.push(`  ${key}${isRequired ? '' : '?'}: ${type}`)
          return acc
        }, []).join('\n')
        const emitsScheme = componentScheme.eventsScheme
        const emitsString = Object.keys(emitsScheme || {}).reduce((acc, key) => {
          const config = emitsScheme[key]
          const type = config.tsType || ` (${config.cbVar?.split(', ').map(v => `${v}: any`).join(', ') ?? ''}) => void`
          const keyString = key.includes(':') ? `"${key}"` : key
          acc.push(`  ${keyString}: ${type}`)
          return acc
        }, []).join('\n')
        const slotsScheme = componentScheme.slotsScheme
        const slotsString = Object.keys(slotsScheme || {}).reduce((acc, key) => {
          const type = slotsScheme[key] || {}
          acc.push(`  ${key}: ${type}`)
          return acc
        }, []).join('\n')

        const content = `export const ${componentScheme.name}: import('@d-render/shared').CustomComponent<{\n${propsString}\n}, {\n${emitsString}\n}, {\n${slotsString}\n}>
export default ${componentScheme.name}
`
        console.log(dir)
        const filename = dir.match(/src\/(.*)\/component.scheme.js/)[1]
        console.log(filename)
        try {
          outputFileSync(buildDirResolve(`../packages/${entry}/types/${filename}.d.ts`), content, 'utf-8')
          componentDTs[componentScheme.name] = `${filename}`
          console.log(
            chalk.green(`generate ./types${filename}.d.ts success !`)
          )
        } catch (error) {
          console.log(error)
        }
        resolve()
      })
    })
  }))
}

// 生成main.d.ts类型
genComponentsDTs().then(res => {
  const mainContent = `export {
  DRender,
  settingValueTransformState,
  generateFieldList,
  insertFieldConfigToList,
  keysToConfigMap,
  defineSearchFieldConfig,
  defineFormFieldConfig,
  defineTableFieldConfig
} from '@d-render/shared'
${Object.keys(componentDTs).reduce((acc, key) => {
    acc.push(`export { ${key} } from './${componentDTs[key]}'`)
    return acc
  }, []).join('\n')}
`
  try {
    outputFileSync(buildDirResolve(`${projectPath}/types/main.d.ts`), mainContent, 'utf-8')
    console.log(
      chalk.green('generate ./types/main.d.ts success !')
    )
  } catch (e) {
    console.log(e)
  }
})
