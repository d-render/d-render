import { computed, ComputedRef } from 'vue'
import type { Ref } from 'vue'
import { getRulesByFieldConfig } from '../form-item-rules'
import type { IAnyObject, TFormConfig } from '@d-render/shared'
import type { Translator } from '../../locale'
export const useRules = (
  config: ComputedRef<TFormConfig>,
  isReadonly: Ref<boolean>,
  status: ComputedRef<'read'|'read-write'|'hidden'>,
  otherValue: ComputedRef<unknown>,
  dependOnValues: Ref<IAnyObject>,
  outDependOnValues: Ref<IAnyObject>,
  t?: Translator
) => {
  const usingRules = computed(() => {
    return !(isReadonly.value || config.value.disabled || config.value._isShow === false || status.value !== 'read-write')
  })
  const rules = computed(() => {
    if (usingRules.value) {
      return getRulesByFieldConfig(config.value, otherValue.value, dependOnValues.value, outDependOnValues.value, t)
    } else {
      return []
    }
  })
  return {
    usingRules,
    rules
  }
}
