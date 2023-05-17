import { computed } from 'vue';
import { getRulesByFieldConfig } from '../form-item-rules';

const useRules = (config, isReadonly, status, otherValue, dependOnValues, outDependOnValues) => {
  const usingRules = computed(() => {
    return !(isReadonly.value || config.value.disabled || config.value._isShow === false || status.value !== "read-write");
  });
  const rules = computed(() => {
    if (usingRules.value) {
      return getRulesByFieldConfig(config.value, otherValue.value, dependOnValues.value, outDependOnValues.value);
    } else {
      return [];
    }
  });
  return {
    usingRules,
    rules
  };
};

export { useRules };
