import dayjs from 'dayjs'
import { getFieldValue, isNotEmpty } from '../../utils'

const state = {}

export const settingValueTransformState = (key, value) => {
  state[key] = value
}
// basic-input 组件默认值模版
export const valueOptions = [
  /* eslint-disable no-template-curly-in-string */
  '${user.displayName}',
  '${user.email}',
  '${user.group.name}',
  '${new Date()}'
  /* eslint-enable */
]

export const getFormValueByTemplate = (template, config) => {
  // 不能完全匹配template的数据 直接返回原始值
  if (typeof template !== 'string') {
    return template
  }
  return template?.replace(/\${([^}]+)}/g, (_, key) => {
    if (key === 'new Date()') {
      return dayjs(Date.now()).format(config?.formatter || 'YYYY-MM-DD HH:mm:ss')
    } else {
      const val = getFieldValue(state, key)
      return isNotEmpty(val) ? val : `\${${key}}`
    }
  })
}
