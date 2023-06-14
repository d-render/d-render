import { CipFormRender } from 'd-render'
import * as service from '@/api'
// import { toRaw } from 'vue'
import { setFieldValue } from '@d-render/shared'
export default {
  name: 'PageRender',
  props: {
    scheme: Object,
    model: Object
  },
  emits: ['update:model'],
  setup (props, { emit }) {
    const dataBus = (target, data) => {
      // 目标数据， data
      console.log('define', target, data)
      // const model = toRaw(props.model) // 导致无响应
      const model = props.model
      setFieldValue(model, target, data)
      console.log(model)
      emit('update:model', model)
    }
    return () => <div>
        <CipFormRender
          model={props.model}
          onUpdate:model={val => emit('update:model', val)}
          dataBus={dataBus}
          service={service}
          scheme={props.scheme}
        />
    </div>
  }
}
