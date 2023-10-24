import { computed, ref, watch, reactive, provide, defineComponent, ComputedRef } from 'vue'
import type { PropType } from 'vue'
import type { IAnyObject, IFormConfig } from '@d-render/shared'
import CipForm from '../cip-form'

interface ISchema {
  list: Array<IFormConfig>
  labelWidth: string | number
  labelPosition: 'left'|'right'| 'top'
  labelSuffix: string
  grid: number
  methods: Record<string, string>
  init: string[]
}

export default defineComponent({
  name: 'CipFormRender',
  props: {
    scheme: Object as PropType<Partial<ISchema>>,
    schema: { type: Object as PropType<Partial<ISchema>>, required: true },
    model: { type: Object as PropType<IAnyObject>, required: true },
    equipment: { type: String as PropType<'pc'|'mobile'>, default: 'pc' },
    service: Object,
    dataBus: Function as PropType<(key: string, val: unknown) => void>
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
    const labelWidth: ComputedRef<string|number> = computed(() => schemaBridge.value.labelWidth || 100)
    const labelSuffix = computed(() => schemaBridge.value.labelSuffix || ' ')
    const grid = computed(() => schemaBridge.value.grid || 1)
    const methods = computed(() => {
      return Object.keys(schemaBridge.value.methods || {}).reduce((acc: Record<string, () => void>, key) => {
        // eslint-disable-next-line no-new-func
        acc[key] = (new Function('model', 'service', schemaBridge.value.methods![key])).bind(null, props.model, props.service)
        return acc
      }, {})
    })
    provide('cipFormRender', reactive({
      methods
    }))
    const init:ComputedRef<Array<string>> = computed(() => schemaBridge.value.init || [])
    watch(() => schemaBridge.value, () => {
      if (init.value) {
        init.value.forEach(key => {
          const method = methods.value[key]
          if (typeof method === 'function') {
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
})
