import { computed, ref } from 'vue'
export const useCompose = (props, { equalKey = 'name', activeKey, custom }) => {
  const value = ref()
  const list = computed(() => {
    const result = custom.filter(v => !!v)
    return result
  })
  if (list.value.find(v => v[equalKey] === props[activeKey])) {
    value.value = props[activeKey]
  } else {
    value.value = list.value[0]?.[equalKey]
  }
  return [value, list]
}
