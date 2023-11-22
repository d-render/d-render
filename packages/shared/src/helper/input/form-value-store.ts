import dayjs from 'dayjs'
import { getFieldValue, isNotEmpty } from '../../utils'

const state = {} as Record<string, unknown>

export const settingValueTransformState = (key: string, value: unknown) => {
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

export const getFormValueByTemplate = (template: string, config?: {formatter?: string}) => {
  // 不能完全匹配template的数据 直接返回原始值
  if (typeof template !== 'string') {
    return template
  }
  return template?.replace(/\${([^}]+)}/g, (_, key: string) => {
    if (key === 'new Date()') {
      return dayjs(Date.now()).format(config?.formatter || 'YYYY-MM-DD HH:mm:ss')
    } else {
      const val = getFieldValue(state, key)
      return isNotEmpty(val) ? val as string : `\${${key}}`
    }
  })
}
