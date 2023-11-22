import { ref, computed } from 'vue'
export const useSelect = () => {
  const selectItem = ref({})
  const selectItemId = computed(() => {
    return selectItem.value?.id
  })
  const changeSelect = (fieldConfig) => {
    selectItem.value = fieldConfig
  }
  const updateSelectItem = (val, withHook) => {
    // 使用地址引用的特性修改值
    if (withHook) {
      selectItem.value.key = val.key || ''
      selectItem.value.config = val
    } else {
      selectItem.value = val
    }
  }

  return { selectItem, selectItemId, changeSelect, updateSelectItem }
}
