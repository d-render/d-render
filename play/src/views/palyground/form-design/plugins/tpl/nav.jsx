import { CipForm } from 'd-render'
import './index.less'

export default {
  inheritAttrs: false,
  props: {
    data: Array
  },
  emits: ['update:schema'],
  setup (props, { emit }) {
    const onClick = (item) => {
      emit('update:schema', item.source)
    }
    console.log(props.data)
    return () => <>
      {
        props.data?.map(item => (
          <div class="design-template" onClick={() => onClick(item)}>
            <div class="design-template-title">{item.name.value}</div>
            <div class="design-template-render">
              <CipForm
                model={{}}
                fieldList={item.source.list}
                showOnly={true}
              />
            </div>
            <div class="design-template-cover"></div>
          </div>
        ))
      }
    </>
  }
}
