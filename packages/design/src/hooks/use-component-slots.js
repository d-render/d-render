import { computed } from 'vue'
import { useFormLayoutOptions, isArray } from '@d-render/shared'

export const useComponentSlots = (props, context) => {
  const { options, proxyValue, updateConfig, ...handler } = useFormLayoutOptions({ props, emit: context.emit })
  const componentSlots = computed(() => {
    if (props.config.usingSlots) {
      return props.config.usingSlots.reduce((acc, name, idx) => {
        const slotConfig = options.value.find(v => v.key === name)
        acc[name] = () => context.slots.item({ children: slotConfig?.children ?? [], optionIndex: idx, isShow: props.config._isShow, ...handler })
        return acc
      }, {})
    }
    return options.value.reduce((acc, slotConfig, idx) => {
      if (isArray(slotConfig.children)) {
        console.log(slotConfig.children)
        acc[slotConfig.key] = () => context.slots.item({ children: slotConfig.children, optionIndex: idx, isShow: props.config._isShow, ...handler })
      }
      return acc
    }, {})
  })
  return { componentSlots, proxyValue }
}
