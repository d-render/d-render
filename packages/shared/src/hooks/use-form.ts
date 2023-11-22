import { provide, reactive, toRef, inject, Ref } from 'vue'
import { FormItemContext, FormContext, formContextKey, formItemContextKey } from 'element-plus'
import { IAnyObject } from '../utils'

interface FormInject {
  labelPosition?: string
  equipment?: string
  uploadQueue?: Record<string, boolean>
}

export const useFormProvide = (props: IAnyObject, uploadQueue?: Ref<Record<string, boolean>>) => {
  const cipFormProvide: FormInject = reactive({
    labelPosition: toRef(props, 'labelPosition') as Ref<string>,
    equipment: toRef(props, 'equipment') as Ref<string>,
    uploadQueue
  })
  provide('cipForm', cipFormProvide)
}

export const useFormInject = () => {
  const cipForm = inject<Partial<FormInject>>('cipForm', {})
  return cipForm
}

export const useElFormItemInject = () => {
  const elFormItem = inject<FormItemContext>(formItemContextKey, {} as FormItemContext)
  return elFormItem
}

export const useElFormInject = () => {
  const elForm = inject<FormContext>(formContextKey, {} as FormContext)
  return elForm
}
