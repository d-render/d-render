import { defineComponent, provide, reactive, watchEffect } from 'vue'
import { useCipConfig } from '@d-render/shared'
import type { IAnyObject } from '@d-render/shared'

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
  setup (_, { attrs, slots }) {
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

    return () => slots.default?.()
  }
})
