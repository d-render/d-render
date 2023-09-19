import { isInputEmpty } from '@d-render/shared'
import type { FormItemRule } from 'element-plus'

export type TValidator = FormItemRule['validator']// (rule: IRule, value: string, callback: (error?: Error)=>void) => void
/**
 *  邮箱验证
 * @param {*} rule
 * @param {*} value
 * @param {Function} callback
 */
export const emailValidator: TValidator = (rule, value: string, callback) => {
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  if (isInputEmpty(value) || reg.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message as string || '请填写正确的邮箱地址'))
  }
}
/**
 * 身份证号校验
 * @param {*} rule
 * @param {*} value
 * @param {Function} callback
 */
export const identityCardValidator: TValidator = (rule, value, callback) => {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  if (isInputEmpty(value) || reg.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message as string || '请填写正确的身份证号'))
  }
}

/**
 * 手机号校验
 * @param {*} rule
 * @param {*} value
 * @param {Function} callback
 */
export const mobilePhoneValidator: TValidator = (rule, value, callback) => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[13589])[0-9]{8}$/
  if (isInputEmpty(value) || reg.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message as string || '请填写正确的手机号'))
  }
}

/**
 * sql语句简单校验校验
 * @param {*} rule
 * @param {*} value
 * @param {Function} callback
 */
export const sqlSimpleValidator: TValidator = (rule, value, callback) => {
  const reg = /^select/i
  if (isInputEmpty(value) || reg.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message as string || 'sql语句以select开头'))
  }
}
