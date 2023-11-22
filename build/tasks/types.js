/**
 * @description 此文件用于生成按需引入的组件
 */
// require('@esbuild-kit/cjs-loader')
import { buildDirResolve } from '../utils/path.js'
import '@esbuild-kit/cjs-loader'
import chalk from 'chalk'
import fglob from 'fast-glob'
import FsExtra from 'fs-extra'
const { writeFileSync } = FsExtra
// const { buildDirResolve } = require('../utils/path')
console.log('buildDirResolve', buildDirResolve)
// const chalk = require('chalk')
// const fglob = require('fast-glob')
// const { writeFileSync } = require('fs-extra')
const entry = process.env.ENTRY_MODULE || 'cip-styles'
console.log('types entry', entry)
const packageBase = buildDirResolve(`../packages/${entry}`)
const dirs = fglob.sync(`${packageBase}/src/**/component.scheme.js`)

const getTsTypeByType = (type) => {
  if (Array.isArray(type)) {
    return type.map(t => getTsTypeByType(t)).join('|')
  }
  if (type === Object) return 'IAnyObject'
  if (type === String) return 'string'
  if (type === Boolean) return 'boolean'
  if (type === Number) return 'number'
  if (type === Function) return '(()=>void)'
  if (type === Array) return 'Array<any>'
}

const formatKey = (key) => {
  if (/(-|:)/.test(key)) {
    return `'${key}'`
  } else {
    return key
  }
}

// 生产组件类型

const componentDTs = {}
const genComponentsDTs = () => {
  return Promise.all(dirs.map(dir => {
    // const componentScheme = require(dir)/**/
    return new Promise((resolve) => {
      console.log(dir)
      import(dir).then((res) => {
        console.log(res)
        const { componentScheme } = res.default
        const propsScheme = componentScheme.propsScheme
        const propsString = Object.keys(propsScheme).reduce((acc, key, i) => {
          const config = propsScheme[key]
          const type = config.tsType || getTsTypeByType(config.type)
          const isRequired = config.required ? '' : '?'

          acc.push(`  ${formatKey(key)}${isRequired}: ${type}` + (config.intro ? ` // ${config.intro}` : ''))
          return acc
        }, []).join('\n')
        const emitsScheme = componentScheme.eventsScheme
        const emitsString = Object.keys(emitsScheme || {}).reduce((acc, key) => {
          const config = emitsScheme[key]
          const type = config.tsType || `(${config.cbVar?.split(', ').map(v => `${formatKey(v)}: any`).join(', ') ?? ''}) => void`
          const keyString = formatKey(key) // key.includes(':') ? `'${key}'` : key
          acc.push(`  ${keyString}?: ${type}`)
          return acc
        }, []).join('\n')
        const slotsScheme = componentScheme.slotsScheme
        const slotsLen = Object.keys(slotsScheme || {}).length
        const slotsString = Object.keys(slotsScheme || {}).reduce((acc, key) => {
          const type = JSON.stringify(slotsScheme[key] || {})
          acc.push(`  ${formatKey(key)}?: ${type}`)
          return acc
        }, []).join('\n')

        const componentName = componentScheme.name || 'Component'
        const content = `import { CustomComponent, IAnyObject } from '@xdp/types'
export const ${componentName}: CustomComponent<{\n${propsString}\n}, {\n${emitsString}\n}${slotsLen > 0 ? ',{\n' + slotsString + '\n}' : ''}>
export default ${componentName}
`
        const filename = dir.replace(packageBase, '').replace('/src', '').replace('/component.scheme.js', '')
        try {
          writeFileSync(`${packageBase}/types${filename}.d.ts`, content, 'utf-8')
          componentDTs[componentName] = `.${filename}`
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
  let mainContent = ''
  if (Object.keys(componentDTs).length > 1) {
    mainContent = `${Object.keys(componentDTs).reduce((acc, key) => {
      acc.push(`export { ${key} } from '${componentDTs[key]}'`)
      return acc
    }, []).join('\n')}
`
  } else {
    mainContent = `${Object.keys(componentDTs).reduce((acc, key) => {
      acc.push(`export { ${key} as default } from '${componentDTs[key]}'`)
      return acc
    }, []).join('\n')}
`
  }
  try {
    writeFileSync(`${packageBase}/types/main.d.ts`, mainContent, 'utf-8')
    console.log(
      chalk.green('generate ./types/main.d.ts success !')
    )
  } catch (e) {
    console.log(e)
  }
})

// 表单设计弹框特殊引入
