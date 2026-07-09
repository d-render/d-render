import { isInputEmpty } from '@d-render/shared'
import type { FormItemRule } from 'element-plus'
import { defaultLocale, translate, type Translator } from '../locale'

export type TValidator = FormItemRule['validator']

const fallbackT: Translator = (path, option) => translate(path, option, defaultLocale)

const createTypedValidator = (
  test: (value: string) => boolean,
  messagePath: string,
  t: Translator
): TValidator => {
  return (rule, value, callback) => {
    const str = value as string
    if (isInputEmpty(str) || test(str)) {
      callback()
    } else {
      callback(new Error(rule.message as string || t(messagePath)))
    }
  }
}

export type BuiltinValidators = {
  email: TValidator
  identityCard: TValidator
  mobilePhone: TValidator
  sql: TValidator
}

/** 创建绑定 Translator 的内置校验器，优先使用当前 locale */
export const createValidators = (t: Translator = fallbackT): BuiltinValidators => ({
  email: createTypedValidator(
    (value) => /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value),
    'dr.form.email',
    t
  ),
  identityCard: createTypedValidator(
    (value) => /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value),
    'dr.form.identityCard',
    t
  ),
  mobilePhone: createTypedValidator(
    (value) => /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[13589])[0-9]{8}$/.test(value),
    'dr.form.mobilePhone',
    t
  ),
  sql: createTypedValidator(
    (value) => /^select/i.test(value),
    'dr.form.sql',
    t
  )
})

const defaultValidators = createValidators(fallbackT)

/**
 *  邮箱验证
 */
export const emailValidator: TValidator = defaultValidators.email
/**
 * 身份证号校验
 */
export const identityCardValidator: TValidator = defaultValidators.identityCard
/**
 * 手机号校验
 */
export const mobilePhoneValidator: TValidator = defaultValidators.mobilePhone
/**
 * sql语句简单校验
 */
export const sqlSimpleValidator: TValidator = defaultValidators.sql
