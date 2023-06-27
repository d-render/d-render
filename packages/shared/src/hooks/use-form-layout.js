import { computed } from 'vue'
import { getNextItem, isEmptyObject } from '../utils'
import { getCopyItem } from '../helper'

export const useFormLayoutOptions = ({ props, emit, optionsKey = 'options' }) => {
  const options = computed(() => {
    return props.config[optionsKey] || []
  })

  const updateConfig = (config) => {
    emit('update:config', config)
  }

  const updateOptionChildren = (optionIndex, children) => {
    const config = props.config
    config[optionsKey][optionIndex].children = children
    updateConfig(config)
  }

  const updateOptionChild = (optionIndex, childIndex, childConfig) => {
    const config = props.config
    config[optionsKey][optionIndex].children[childIndex].config = childConfig
    updateConfig(config)
  }
  const deleteOptionChild = (optionIndex, childIndex) => {
    const config = props.config
    const nextItem = getNextItem(config[optionsKey][optionIndex].children, childIndex)
    if (!isEmptyObject(nextItem)) {
      emitSelectItem(nextItem)
    } else {
      emitSelectItem(props.config)
    }
    config[optionsKey][optionIndex].children.splice(childIndex, 1)
    updateConfig(config)
  }
  const copyOptionChild = (optionIndex, childIndex) => {
    const config = props.config
    const newItem = getCopyItem(config[optionsKey][optionIndex].children[childIndex])
    config[optionsKey][optionIndex].children.splice(childIndex + 1, 0, newItem)
    updateConfig(config)
    emitSelectItem(newItem)
  }
  const addOptionChild = (optionIndex, { newIndex: childIndex }) => {
    const config = props.config
    const newItem = config[optionsKey][optionIndex].children[childIndex]
    updateConfig(config)
    emitSelectItem(newItem)
  }
  // 选中
  const emitSelectItem = (item) => {
    emit('selectItem', item)
  }
  return {
    updateOptionChildren,
    updateOptionChild,
    deleteOptionChild,
    copyOptionChild,
    addOptionChild,
    emitSelectItem,
    options
  }
}
