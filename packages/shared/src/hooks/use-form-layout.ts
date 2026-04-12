import { computed, SetupContext } from 'vue'
import { getNextItem, isEmptyObject, IRenderConfig, IFieldItem, IAnyObject } from '../utils'
import { getCopyItem, LayoutProps } from '../helper'
export const useFormLayoutOptions = ({ props, emit, optionsKey = 'options' }: {
  props: LayoutProps,
  emit: SetupContext['emit'],
  optionsKey: string
}) => {
  const options = computed(() => {
    return (props.config as IAnyObject)[optionsKey] || []
  })
  const proxyValue = computed({
    get () { return props.modelValue },
    set (val) { emit('update:modelValue', val) }
  })
  // 更新整个layout的config
  const updateConfig = (config: IRenderConfig) => {
    emit('update:config', config)
  }
  // 更新单layout option 中的 children
  const updateOptionChildren = (optionIndex: number, children: Array<IFieldItem>) => {
    const config = props.config as IAnyObject;
    (config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children = children
    updateConfig(config)
  }
  // 更新单layout option 中的 child
  const updateOptionChild = (optionIndex: number, childIndex: number, childConfig: IRenderConfig) => {
    const config = props.config as IAnyObject;
    (config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children[childIndex].config = childConfig
    updateConfig(config)
  }
  const deleteOptionChild = (optionIndex: number, childIndex: number) => {
    const config = props.config as IAnyObject
    const nextItem = getNextItem((config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children as unknown as IAnyObject[], childIndex)
    if (!isEmptyObject(nextItem)) {
      emitSelectItem(nextItem)
    } else {
      emitSelectItem(props.config)
    }
    (config[optionsKey] as Array<{children: IRenderConfig[]}>)[optionIndex].children.splice(childIndex, 1)
    updateConfig(config)
  }
  const copyOptionChild = (optionIndex: number, childIndex: number) => {
    const config = props.config as IAnyObject
    const newItem = getCopyItem(
      (config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children[childIndex]
    ) as IFieldItem;
    (config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children.splice(childIndex + 1, 0, newItem)
    updateConfig(config)
    emitSelectItem(newItem)
  }
  const addOptionChild = (optionIndex: number, { newIndex: childIndex }: {newIndex: number}) => {
    const config = props.config as IAnyObject
    const newItem = (config[optionsKey] as Array<{children: IFieldItem[]}>)[optionIndex].children[childIndex]
    updateConfig(config)
    emitSelectItem(newItem)
  }
  // 选中
  const emitSelectItem = (item: IFieldItem|IRenderConfig) => {
    emit('selectItem', item)
  }
  return {
    updateOptionChildren,
    updateOptionChild,
    deleteOptionChild,
    copyOptionChild,
    addOptionChild,
    emitSelectItem,
    proxyValue,
    options
  }
}
