import { provide, reactive, toRef, inject } from 'vue'
import { formContextKey, formItemContextKey } from 'element-plus'
export const useFormProvide = (props, uploadQueue) => {
  const cipFormProvide = reactive({
    labelPosition: toRef(props, 'labelPosition'),
    equipment: toRef(props, 'equipment'),
    uploadQueue: uploadQueue
  })
  provide('cipForm', cipFormProvide)
}

export const useFormInject = () => {
  const cipForm = inject('cipForm', {})
  return cipForm
}

export const useElFormItemInject = () => {
  const elFormItem = inject(formItemContextKey, {})
  return elFormItem
}

export const useElFormInject = () => {
  const elForm = inject(formContextKey, {})
  return elForm
}
