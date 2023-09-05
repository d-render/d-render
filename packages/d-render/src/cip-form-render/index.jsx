import { computed, ref, watch, reactive, provide } from 'vue'
import CipForm from '../cip-form'
export default {
  name: 'CipFormRender',
  props: {
    scheme: Object,
    schema: Object,
    model: Object,
    equipment: { type: String, default: 'pc' },
    service: Object
  },
  emits: ['update:model'],
  setup (props, { emit, expose }) {
    const schemaBridge = computed(() => {
      return props.schema ?? props.scheme
    })
    const cipFormRef = ref(null)
    // const instance = getCurrentInstance()
    const fieldList = computed(() => schemaBridge.value.list || [])
    const labelPosition = computed(() => schemaBridge.value.labelPosition || 'right')
    const labelWidth = computed(() => schemaBridge.value.labelWidth || 100)
    const labelSuffix = computed(() => schemaBridge.value.labelSuffix || ' ')
    const grid = computed(() => schemaBridge.value.grid || 1)
    const methods = computed(() => {
      return Object.keys(schemaBridge.value.methods || {}).reduce((acc, key) => {
        // eslint-disable-next-line no-new-func
        acc[key] = (new Function('model', 'service', schemaBridge.value.methods[key])).bind(null, props.model, props.service)
        return acc
      }, {})
    })
    provide('cipFormRender', reactive({
      methods
    }))
    const init = computed(() => schemaBridge.value.init)
    watch(() => schemaBridge.value, () => {
      if (init.value) {
        init.value.forEach(key => {
          const method = methods.value[key]
          if (method) {
            method()
          }
        })
      }
    }, { immediate: true })

    // instance.ctx.cipFormRef = cipFormRef
    expose({
      cipFormRef
    })
    return () => <CipForm
      ref={cipFormRef}
      model={props.model}
      onUpdate:model={(val) => emit('update:model', val)}
      fieldList={fieldList.value}
      labelPosition={labelPosition.value}
      equipment={props.equipment}
      labelWidth={labelWidth.value}
      labelSuffix={labelSuffix.value}
      grid={grid.value}
      dataBus={props.dataBus}
    />
  }
}
