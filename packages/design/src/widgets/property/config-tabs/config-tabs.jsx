// 导入必要的库和组件
import { defineComponent } from 'vue'
import ConfigTab from './config-tab'

export default defineComponent({
  props: {
    active: String,
    list: Array
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const activeGroup = (name) => {
      emit('update:active', name)
    }

    return () => (
      <div class="config-tabs">
      {props.list.map(group => (
        <ConfigTab
          key={group.name}
          name={group.name}
          is-active={group.name === props.active}
          onClick={() => activeGroup(group.name)}
        >
        {group.title}
        </ConfigTab>
      ))}
      </div>
    )
  }
})
