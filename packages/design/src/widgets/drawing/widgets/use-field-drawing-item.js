import { computed } from 'vue'

export const useFieldDrawingItem = ({ props, emit }) => {
  // FEAT: drawType优先级高于type
  const computedConfig = computed(() => {
    let result = props.config || {}
    if (result.drawType) {
      result = { ...result, type: result.drawType }
    }
    return result
    // return handleFormConfig(props.config)
  })
  const deleteItem = (e) => {
    emit('delete')
    e.stopPropagation()
  }
  const copyItem = (e) => {
    emit('copy')
    e.stopPropagation()
  }
  return {
    computedConfig,
    deleteItem,
    copyItem
  }
}
