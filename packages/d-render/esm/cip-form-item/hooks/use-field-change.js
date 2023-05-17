import { ref, toRef, computed, watch } from 'vue';
import { getFieldValue } from '@d-render/shared';
import { getChangeIndex, getValuesByKeys } from '../util';

const useFieldChange = (props, securityConfig, dependOnWatchCb) => {
  const changeCount = ref(0);
  const dependOnValues = ref([]);
  const outDependOnValues = ref([]);
  const tableDependOnValues = toRef(props, "tableDependOnValues");
  const model = toRef(props, "model");
  const dependOn = computed(() => securityConfig.value.dependOn || []);
  const outDependOn = computed(() => securityConfig.value.outDependOn || []);
  const depend = props.inTable ? dependOn.value.concat(outDependOn.value) : dependOn.value;
  const generateWatchValue = () => {
    let result = watchValue(model, dependOn.value);
    if (props.inTable) {
      result = result.concat(watchValue(tableDependOnValues, outDependOn.value));
    }
    return result;
  };
  const filterSelf = (dependOn2) => {
    return dependOn2.filter((key) => {
      if (typeof key === "object")
        key = key.key;
      return key !== props.fieldKey;
    });
  };
  const watchValue = (target, dependOn2) => filterSelf(dependOn2).map((key) => {
    if (typeof key === "object")
      key = key.key;
    return () => getFieldValue(target.value, key);
  });
  const getChange = (values, oldValues, depend2) => {
    const changeIndex = getChangeIndex(values, oldValues);
    const changeValue = changeIndex.map((index) => values[index]);
    const changeOldValues = changeIndex.map((index) => oldValues[index]);
    const changeKeys = changeIndex.map((index) => depend2[index]);
    return { changeValue, changeOldValues, changeKeys };
  };
  const collectDependInfo = () => {
    const values = getValuesByKeys(model.value, dependOn.value);
    const outValues = getValuesByKeys(tableDependOnValues.value, outDependOn.value);
    dependOnValues.value = values;
    outDependOnValues.value = outValues;
  };
  if (depend.length > 0) {
    let unwatch;
    watch(model, () => {
      changeCount.value++;
      if (unwatch)
        unwatch();
      let firstChange = true;
      unwatch = watch(generateWatchValue(), (values, oldValues) => {
        const change = getChange(values, oldValues, filterSelf(depend));
        collectDependInfo();
        dependOnWatchCb(change, {
          executeChangeValueEffect: securityConfig.value.immediateChangeValue || !firstChange,
          values: dependOnValues.value,
          outValues: outDependOnValues.value
        });
        firstChange = false;
      }, { deep: true, immediate: true });
    }, { immediate: true });
  }
  return {
    changeCount,
    dependOnValues,
    outDependOnValues
  };
};

export { useFieldChange };
