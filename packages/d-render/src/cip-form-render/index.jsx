import { computed, getCurrentInstance, ref, watch, reactive, provide } from 'vue'
import CipForm from '../cip-form'
import { settingValueTransformState, getFormValueByTemplate } from '@d-render/shared'
export default {
  name: 'CipFormRender',
  props: {
    scheme: Object,
    model: Object,
    equipment: { type: String, default: 'pc' },
    service: Object
  },
  emits: ['update:model'],
  setup (props, { emit, expose }) {
    watch(() => props.model, (val) => {
      settingValueTransformState('form', val)
      // eslint-disable-next-line no-template-curly-in-string
      console.log(getFormValueByTemplate('${form.select_4723042d}'))
    }, { immediate: true, deep: true })
    const cipFormRef = ref(null)
    const instance = getCurrentInstance()
    const fieldList = computed(() => props.scheme.list || [])
    const labelPosition = computed(() => props.scheme.labelPosition || 'right')
    const labelWidth = computed(() => props.scheme.labelWidth || 100)
    const labelSuffix = computed(() => props.scheme.labelSuffix || ' ')
    const grid = computed(() => props.scheme.grid || 1)
    const methods = computed(() => {
      return Object.keys(props.scheme.methods || {}).reduce((acc, key) => {
        // eslint-disable-next-line no-new-func
        acc[key] = (new Function('model', 'service', props.scheme.methods[key])).bind(null, props.model, props.service)
        return acc
      }, {})
    })
    provide('cipFormRender', reactive({
      methods
    }))
    const init = computed(() => props.scheme.init)
    watch(() => props.scheme, () => {
      if (init.value) {
        init.value.forEach(key => {
          const method = methods.value[key]
          if (method) {
            method()
          }
        })
      }
    }, { immediate: true })

    instance.ctx.cipFormRef = cipFormRef
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
