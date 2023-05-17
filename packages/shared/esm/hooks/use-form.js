import { reactive, toRef, provide, inject } from 'vue';
import { formItemContextKey, formContextKey } from 'element-plus';

const useFormProvide = (props, uploadQueue) => {
  const cipFormProvide = reactive({
    labelPosition: toRef(props, "labelPosition"),
    equipment: toRef(props, "equipment"),
    uploadQueue
  });
  provide("cipForm", cipFormProvide);
};
const useFormInject = () => {
  const cipForm = inject("cipForm", {});
  return cipForm;
};
const useElFormItemInject = () => {
  const elFormItem = inject(formItemContextKey, {});
  return elFormItem;
};
const useElFormInject = () => {
  const elForm = inject(formContextKey, {});
  return elForm;
};

export { useElFormInject, useElFormItemInject, useFormInject, useFormProvide };
