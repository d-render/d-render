import { CipForm } from 'd-render'
import { methodsConfigFieldList } from './config'
import { customRef } from 'vue'
const useDeepComputed = ({ get, set }) => {
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

export default {
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const modelValue = useDeepComputed({
      get () {
        console.log(props.modelValue)
        return props.modelValue
      },
      set (newVal) {
        emit('update:modelValue', newVal)
      }
    })

    return () => <div style={'padding: 0 12px;'}>
      <CipForm
        v-model:model={modelValue.value}
        fieldList={methodsConfigFieldList}
      />
    </div>
  }
}
