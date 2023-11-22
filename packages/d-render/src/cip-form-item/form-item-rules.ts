// 可以转换的validateType
import {
  emailValidator,
  identityCardValidator,
  mobilePhoneValidator,
  sqlSimpleValidator

} from './form-validator'
import type { TValidator } from './form-validator'
import type { IAnyObject, IRenderConfig } from '@d-render/shared'
import type { FormItemRule } from 'element-plus'

interface ICustomValidator {
   (values: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject): Promise<{data?: boolean ; message?: string }>
  message: string
  type: string
}

const validatorMap: Record<string, TValidator> = {
  email: emailValidator,
  identityCard: identityCardValidator,
  mobilePhone: mobilePhoneValidator,
  sql: sqlSimpleValidator
}

const isInputType = (config: IRenderConfig) => {
  if (config.triggerType === 'input') { return true }
  if (config.triggerType === 'select') { return false }
  // 兼容老的未设置triggerType的表单数据验证
  return ['input', 'textarea', 'number', 'numberRange', 'table', 'password', undefined].includes(config.type)
}
export interface RequiredRule {
  type?: string
  required?: boolean
  message?: string
  [propname: string]: unknown
}
// 获取单字段规则
export const getRulesByFieldConfig = (config: IRenderConfig, otherValue: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject) => {
  const rules = [] as FormItemRule[]
  if (config.required) { // 必填
    const defaultPreText = isInputType(config) ? '请输入' : '请选择'
    const requiredMessage = config.requiredErrorMessage || `${defaultPreText}${config.label}`
    const requiredRule = { required: true, message: requiredMessage, ...config.requiredRuleConfig as IAnyObject } as FormItemRule
    if (config.requiredType) {
      requiredRule.type = config.requiredType
    }
    rules.push(requiredRule)
    // 双值验证
    if (config.type === 'dateRange' && config.otherKey) { // 日期范围
      const validator:TValidator = (rule, value, cb) => {
        if (value) {
          if (otherValue) {
            cb()
          } else {
            cb(new Error(requiredMessage + '-结束时间'))
          }
        } else {
          cb()
        }
      }
      const otherRules = { validator }
      rules.push(otherRules)
    }
  }
  // 提取公共函数
  const pushValidatorFunction = (validator: TValidator, type?: string) => {
    const message = config.validateValueErrorMessage as string
    const rule: { validator: TValidator, trigger: string, message?: string } = {
      validator,
      trigger: type || 'blur'
    }
    if (message) {
      rule.message = message
    }
    return rule
  }
  if (config.validateValue && validatorMap[config.validateValue]) { // 内置值类型校验
    const validator = validatorMap[config.validateValue] as TValidator
    if (validator) {
      rules.push(pushValidatorFunction(validator))
    }
  }
  // 正则校验
  if (config.regexpValidate) {
    try {
      const reg = new RegExp(config.regexpValidate as string)

      const rule = {
        pattern: reg,
        message: config.regexpValidateErrorMessage || `未能通过${reg.toString()}校验`,
        trigger: 'blur'
      }
      rules.push(rule)
    } catch (e: unknown) { console.log((e as Error).message) }
  }
  // 远程校验值是否已经存在
  if (config.validateExistRemote) {
    // @ts-ignore  Promise<void> === void
    const validator: TValidator = async (rule, value, callback) => {
      const { data } = await config.validateExistRemote!(value, dependOnValues, outDependOnValues)
      if (data) { // data 为真值是校验失败
        callback(new Error(config.validateExistRemoteErrorMessage || rule.message as string || '已存在'))
      } else {
        callback()
      }
    }
    rules.push(pushValidatorFunction(validator))
  }
  // 自定义验证器
  if (config.customValidators) {
    const customRules = (
      config.customValidators as Array<ICustomValidator>
    ).map(customValidator => {
      // @ts-ignore  Promise<void> === void
      const validator: TValidator = async (rule, value, callback) => {
        const { data, message } = await customValidator(value, dependOnValues, outDependOnValues)
        if (!data) { // data 为假值是校验失败
          const errorMessage = customValidator.message || message || rule.message as string
          callback(new Error(errorMessage))
        } else {
          callback()
        }
      }
      return pushValidatorFunction(validator, customValidator.type)
    })
    rules.push(...customRules)
  }

  return rules
}
