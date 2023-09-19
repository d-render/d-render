import { computed, ref, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { TSearchFormProps } from './props'
import type { IAnyObject, IFormConfig } from '@d-render/shared'
const DEFAULT_SPAN = 1

export const useExpand = (props: TSearchFormProps, gridCount: Ref<number>, searchFormProps: ComputedRef<IAnyObject>) => {
  const isExpand = ref(false)
  const toggleExpand = () => {
    isExpand.value = !isExpand.value
  }
  const getFieldSpan = (fieldConfig: IFormConfig) => {
    const { config = {} } = fieldConfig
    // 处理非整数
    const span = Math.floor(config.span!) || DEFAULT_SPAN
    // 当span 大于最大值时将span设置为gridCount的值
    if (span > gridCount.value) return gridCount.value
    return span as number
  }
  // fieldList中所有的span之和
  const spanSum = computed(() => {
    return props.fieldList!.reduce((acc: number, v) => {
      acc += getFieldSpan(v)
      return acc
    }, 0)
  })

  // 支持2中模式。
  const haveExpand = computed(() => {
    if (searchFormProps.value.collapse) {
      if (props.completeRow) return spanSum.value > gridCount.value
      return spanSum.value >= gridCount.value
    }
    return false
  })

  const rowMaxIndex = computed(() => {
    const list = props.fieldList!
    const len = list.length
    let sum = 0
    for (let i = 0; i < len; i++) {
      sum += getFieldSpan(list[i])
      if (sum === gridCount.value) {
        // 若需要完整的一行则需要+1
        return props.completeRow ? i : i - 1
      }
      if (sum >= gridCount.value) {
        return i - 1
      }
    }
    return len
  })

  // 计算最后一行有多少个span
  const lastRowSpan = computed(() => {
    const list = props.fieldList!
    return list.reduce((acc, v) => {
      const span = getFieldSpan(v)
      acc += span
      if (acc > gridCount.value) return span
      if (acc === gridCount.value) return 0
      return acc
    }, 0)
  })
  // 当前展示的字段
  const showFieldList: ComputedRef<Array<IFormConfig>> = computed(() => {
    if (!searchFormProps.value.collapse) {
      return props.fieldList!
    } else {
      return isExpand.value
        ? props.fieldList!
        : props.fieldList!.filter((item, index) => index <= rowMaxIndex.value)
    }
  })

  watch(() => props.hideSearch, () => {
    // hideSearch时，如果
    if (props.hideSearch) isExpand.value = true
  }, { immediate: true })

  return {
    isExpand,
    toggleExpand,
    spanSum,
    haveExpand,
    showFieldList,
    lastRowSpan
  }
}
