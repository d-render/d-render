import { CipForm } from 'd-render'
import './index.less'

export default {
  props: {
    list: Array
  },
  emits: ['updateSchema'],
  setup (props, { emit }) {
    const onClick = (item) => {
      emit('updateSchema', item.source)
    }

    return () => <el-scrollbar>
      {
        props.list.map(item => (
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
    </el-scrollbar>
  }
}
