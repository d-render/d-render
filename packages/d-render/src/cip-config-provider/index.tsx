import { computed, defineComponent, inject, provide, reactive, ref, watchEffect, type PropType } from 'vue'
import { useCipConfig } from '@d-render/shared'
import type { IAnyObject } from '@d-render/shared'
import { localeContextKey } from '../hooks/use-locale'
import type { Language } from '../locale'

function mergeConfig (...sources: Array<IAnyObject | undefined>): IAnyObject {
  const result: IAnyObject = {}
  for (const source of sources) {
    if (!source) continue
    for (const key of Object.keys(source)) {
      const val = source[key]
      const prev = result[key]
      if (
        val !== null &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        prev !== null &&
        typeof prev === 'object' &&
        !Array.isArray(prev)
      ) {
        result[key] = mergeConfig(prev as IAnyObject, val as IAnyObject)
      } else if (val !== undefined) {
        result[key] = val
      }
    }
  }
  return result
}

export default defineComponent({
  name: 'CipConfigProvide',
  inheritAttrs: false,
  props: {
    locale: Object as PropType<Language>
  },
  setup (props, { attrs, slots }) {
    const parentConfig = useCipConfig()
    const mergedConfig = reactive<IAnyObject>({})

    watchEffect(() => {
      const merged = mergeConfig(
        parentConfig as IAnyObject,
        attrs as IAnyObject
      )
      for (const key of Object.keys(mergedConfig)) {
        if (!(key in merged)) {
          delete mergedConfig[key]
        }
      }
      Object.assign(mergedConfig, merged)
    })

    provide('cip-config', mergedConfig)

    // 嵌套 ConfigProvider 时，未传 locale 则继承父级；均未设置时由 useLocale 回退默认语言
    const parentLocale = inject(localeContextKey, ref<Language | undefined>())
    provide(localeContextKey, computed(() => props.locale ?? parentLocale.value))

    return () => slots.default?.()
  }
})
