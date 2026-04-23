import { computed, ref, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { TSearchFormProps } from './props'
import type { IAnyObject, IFieldItem, TSearchFormConfig } from '@d-render/shared'
const DEFAULT_SPAN = 1

export const useExpand = (props: TSearchFormProps, gridCount: Ref<number>, searchFormProps: ComputedRef<IAnyObject>, operationSpan: Ref<number>) => {
  const isExpand = ref(false)
  const toggleExpand = () => {
    isExpand.value = !isExpand.value
  }
  const getFieldSpan = (fieldConfig: IFieldItem<TSearchFormConfig>) => {
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
      // 操作按钮占 operationSpan 列，threshold 为字段进入按钮区的临界点
      // operationSpan=1 时 threshold=gridCount，与原逻辑完全一致
      const threshold = gridCount.value - operationSpan.value + 1
      if (props.completeRow) return spanSum.value > threshold
      return spanSum.value >= threshold
    }
    return false
  })

  const rowMaxIndex = computed(() => {
    const list = props.fieldList!
    const len = list.length
    let sum = 0
    // 字段进入按钮区的临界点；operationSpan=1 时 threshold=gridCount，与原逻辑完全一致
    const threshold = gridCount.value - operationSpan.value + 1
    for (let i = 0; i < len; i++) {
      sum += getFieldSpan(list[i])
      if (sum === threshold) {
        // 若需要完整的一行则需要+1
        return props.completeRow ? i : i - 1
      }
      if (sum > threshold) {
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
  const showFieldList: ComputedRef<Array<IFieldItem<TSearchFormConfig>>> = computed(() => {
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
