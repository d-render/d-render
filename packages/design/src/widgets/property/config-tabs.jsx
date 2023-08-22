// 导入必要的库和组件
import { defineComponent } from 'vue'
import ConfigTab from './config-tab'

export default defineComponent({
  props: {
    active: String,
    groupList: Array
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const activeGroup = (name) => {
      emit('update:active', name)
    }

    return () => (
      <div class="config-tabs">
      {props.groupList.map(group => (
        <ConfigTab
          key={group.value}
          name={group.value}
          is-active={group.value === props.active}
          onClick={() => activeGroup(group.value)}
        >
        {group.label}
        </ConfigTab>
      ))}
      </div>
    )
  }
})
