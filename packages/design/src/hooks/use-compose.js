import { computed, ref } from 'vue'
export const useCompose = (props, { key, excludeKey, equalKey = 'name', activeKey, defaultValue }) => {
  const value = ref()
  const list = computed(() => {
    let result = defaultValue.concat(props[key]).filter(v => !!v)
    if (props[excludeKey]) {
      result = result.filter(v => !props[excludeKey].includes(v[equalKey]))
    }
    return result
  })
  if (list.value.find(v => v[equalKey] === props[activeKey])) {
    value.value = props[activeKey]
  } else {
    value.value = list.value[0]?.[equalKey]
  }
  return [value, list]
}
