import { computed, ComputedRef } from 'vue'
import type { Ref } from 'vue'
import { getRulesByFieldConfig } from '../form-item-rules'
import type { IAnyObject, IRenderConfig } from '@d-render/shared'
export const useRules = (
  config: Ref<IRenderConfig>,
  isReadonly: Ref<boolean>,
  status: ComputedRef<'read'|'read-write'|'hidden'>,
  otherValue: ComputedRef<unknown>,
  dependOnValues: Ref<IAnyObject>,
  outDependOnValues: Ref<IAnyObject>
) => {
  const usingRules = computed(() => {
    return !(isReadonly.value || config.value.disabled || config.value._isShow === false || status.value !== 'read-write')
  })
  const rules = computed(() => {
    if (usingRules.value) {
      return getRulesByFieldConfig(config.value, otherValue.value, dependOnValues.value, outDependOnValues.value)
    } else {
      return []
    }
  })
  return {
    usingRules,
    rules
  }
}
