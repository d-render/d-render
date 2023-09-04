import { isArray } from '@d-render/shared'

const addQuote = (val) => {
  return `'${val}'`
}

const handleValue = (value) => {
  if (['number', 'boolean'].includes(typeof value)) return value
  if (typeof value === 'object') return JSON.stringify(value)
  if (!value) return addQuote('')
  return addQuote(value)
}

const handleOtherValue = (key, value) => {
  // 多个值处理
  if (isArray(key)) {
    const ret = {}
    key.forEach((k, i) => {
      ret[k] = value[i]
    })
    return JSON.stringify(ret)
  }
  // 单个值直接返回
  return handleValue(value)
}

export const parseConfig = ({config, isCurrentInTable, currOtherKey, fnType = 'value' }) => {
  if (!config?.length) return ''
  let str = ''
  let dependVars = []
  let outDependVars = []
  config.forEach(item => {
    const { value, otherValue, config: configOption, conditions, autoSelect } = item
    let ifStatement = ''
    conditions.forEach((condition, index) => {
      const {
        logic,
        source,
        sign,
        target,
        sourceOtherKey,
        targetOtherValue,
        isInTable,
        type,
        multiple
      } = condition
      if (isCurrentInTable && !isInTable) { // 当前字段在子表单内且依赖主表单字段时用 outDependOnValues
        outDependVars.push(source)
        if (sourceOtherKey) outDependVars.push(sourceOtherKey)
      } else {
        dependVars.push(source)
        if (sourceOtherKey) dependVars.push(sourceOtherKey)
      }
      let currState = `${source} ${sign} ${handleValue(target)}`
      if (sourceOtherKey) {
        currState = autoSelect ? `${currState}` : `(${currState} && ${sourceOtherKey} ${sign} ${handleValue(targetOtherValue)})`
      }
      // 多个值用逗号拼接时的判断
      if (type === 'checkbox' || multiple) {
        currState = sign === '==='
         ? `${source}?.length === '${target}'?.length && ${source}?.split?.(',').every?.(item => '${target}'.indexOf(item) > -1)`
         : `!${source}?.split?.(',').some?.(item => '${target}'.indexOf(item) > -1)`
      }
      currState = ` ${index === 0 ? '' : logic} ${currState}`
      ifStatement += currState
    })
    const autoSelectStatement = () => {
      const sourceOtherKey = config?.[0]?.conditions?.[0]?.sourceOtherKey
      return `
        return {
          value: ${sourceOtherKey}[${handleValue(value)}],
          otherValue: ${handleOtherValue(currOtherKey, otherValue)},
        }
      `
    }
    const _autoSelect = config.some(item => item.autoSelect === true)
    const body = fnType === 'value'
      ? (_autoSelect ? autoSelectStatement() : `
      if(${ifStatement}){
        return {
          value: ${handleValue(value)},
          otherValue: ${handleOtherValue(currOtherKey, otherValue)},
        }
      };`)
      : `
      if(${ifStatement}){
        ${
          Object.keys(configOption).map(key => {
            return `config.${key} = ${handleValue(configOption[key])}`
          }).join('; ')
        }
        return config
      };
      `
    str += body
  })
  // 去重
  dependVars = Array.from(new Set(dependVars))
  outDependVars = Array.from(new Set(outDependVars))
  const declareStatement =
    `const { ${dependVars.join(',')} } = dependOnValues;
    const { ${outDependVars.join(',')} } = outDependOnValues;`
  str = `
    ${declareStatement}
    ${str}
  `
  return str
}

export const parseValueFn = ({config, isCurrentInTable, currOtherKey }) =>
  parseConfig({config, isCurrentInTable, currOtherKey })

export const parseConfigFn = ({config, isCurrentInTable, currOtherKey }) =>
  parseConfig({config, isCurrentInTable, currOtherKey, fnType: 'config' })
