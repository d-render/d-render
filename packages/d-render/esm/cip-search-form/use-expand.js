import { ref, computed, watch } from 'vue';

const DEFAULT_SPAN = 1;
const useExpand = (props, gridCount) => {
  const isExpand = ref(false);
  const toggleExpand = () => {
    isExpand.value = !isExpand.value;
  };
  const getFieldSpan = (fieldConfig) => {
    const { config = {} } = fieldConfig;
    const span = Math.floor(config.span) || DEFAULT_SPAN;
    if (span > gridCount.value)
      return gridCount.value;
    return span;
  };
  const spanSum = computed(() => {
    return props.fieldList.reduce((acc, v) => {
      acc += getFieldSpan(v);
      return acc;
    }, 0);
  });
  const haveExpand = computed(() => {
    if (props.collapse) {
      if (props.completeRow)
        return spanSum.value > gridCount.value;
      return spanSum.value >= gridCount.value;
    }
    return false;
  });
  const rowMaxIndex = computed(() => {
    const len = props.fieldList.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += getFieldSpan(props.fieldList[i]);
      if (sum === gridCount.value) {
        return props.completeRow ? i : i - 1;
      }
      if (sum >= gridCount.value) {
        return i - 1;
      }
    }
    return len;
  });
  const lastRowSpan = computed(() => {
    return props.fieldList.reduce((acc, v, i) => {
      const span = getFieldSpan(v);
      acc += span;
      if (acc > gridCount.value)
        return span;
      if (acc === gridCount.value)
        return 0;
      return acc;
    }, 0);
  });
  const showFieldList = computed(() => {
    if (!props.collapse) {
      return props.fieldList;
    } else {
      return isExpand.value ? props.fieldList : props.fieldList.filter((item, index) => index <= rowMaxIndex.value);
    }
  });
  watch(() => props.hideSearch, () => {
    if (props.hideSearch)
      isExpand.value = true;
  }, { immediate: true });
  return {
    isExpand,
    toggleExpand,
    spanSum,
    haveExpand,
    showFieldList,
    lastRowSpan
  };
};

export { useExpand };
