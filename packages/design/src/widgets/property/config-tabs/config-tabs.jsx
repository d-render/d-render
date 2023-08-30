// 导入必要的库和组件
import { defineComponent } from 'vue'
import ConfigTab from './config-tab'
import { useNamespace } from '@d-render/shared'
export default defineComponent({
  props: {
    active: String,
    list: Array
  },
  emits: ['update:active'],
  setup (props, { emit }) {
    const ns = useNamespace('config-tabs')

    const activeGroup = (name) => {
      emit('update:active', name)
    }

    return () => (
      <div class={ns.b()}>
      {props.list.map(group => (
        <ConfigTab
          key={group.name}
          name={group.name}
          class={[
            ns.e('item'),
            {
              [ns.is('active')]: group.name === props.active
            }
          ]
        }
          is-active={group.name === props.active}
          onClick={() => activeGroup(group.name)}
        >

          <div class={[ns.e('title')]}>{group.title}</div>
        </ConfigTab>
      ))}
      </div>
    )
  }
})
