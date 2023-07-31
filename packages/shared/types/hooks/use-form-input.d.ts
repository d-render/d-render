import { IAnyObject } from '../utils'
import { ComputedRef, Ref, VNode, CSSProperties, SetupContext } from "vue";
import { UpdateFormStream } from '../helper/update-form-stream'
interface IOption {
  fromModelValue?: (modelValue: any) => any // 将modelValue的值转换为input的值
  toModelValue?: (value: any) => any // 将input的值转换为modelValue
  maxOtherKey?: number // 最大的otherKey的值
}
export function useFormInput(props: IAnyObject, context: SetupContext, options?: IOption): {
  inputRef: Ref<Element | VNode>
  inputStyle: ComputedRef<CSSProperties>
  proxyValue: ComputedRef<any>
  securityConfig: ComputedRef<IAnyObject>
  emitInput: (val:any) => void
  emitModelValue: (val: any) => void
  emitOtherValue: (val: any) => void
  updateStream: InstanceType<typeof UpdateFormStream>
  proxyOtherValue: ComputedRef<any>[]
  placeholder?: ComputedRef<string>
  clearable: ComputedRef<boolean>
  width: ComputedRef<string | number>
  noMatchText?: ComputedRef<string>
}

export function useOptions(
  props: IAnyObject,
  multiple: Ref<boolean>|boolean,
  updateStream: UpdateFormStream,
  context?:SetupContext
): {
  optionProps: ComputedRef<{label: string, value: string, children?: string} & IAnyObject>
  options: Ref<Array<string|number|IAnyObject>>
  getOptions: ()=> Promise<Array<string|number|IAnyObject>>
  isObjectOption: ComputedRef<boolean>
  getValue: (modelValue: string) => any
  getModelValue: (getModelValue: string | number | Array<any>) => any
  getOtherValue: (modelValue: string, value: any) => any
  splitKey: ComputedRef<string>
  proxyOptionsValue: ComputedRef<any>
}
export type TKeyMap = string | [string, string] | [string, {key: string, defaultValue?: any}|{key?:string, defaultValue: any}]
export function useInputProps(
  props: IAnyObject,
  propKeys: Array<TKeyMap>
): ComputedRef<IAnyObject>
