import { customRef } from 'vue'
export const useDeepComputed = ({ get, set }) => {
  return customRef((track, trigger) => {
    return {
      get () {
        track()
        return get()
      },
      set (newVal) {
        trigger()
        set(newVal)
      }
    }
  })
}
