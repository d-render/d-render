import ConfigTabs from './config-tabs/config-tabs'
import { ElScrollbar } from 'element-plus'
export default {
  name: 'DrDesignConfigure',
  props: {
    list: Array,
    active: String,
    selectItem: {},
    data: {}
  },
  emits: ['update:active'],
  setup (props, { slots, emit }) {
    return () => <>
      <ConfigTabs
        active={props.active}
        onUpdate:active={(val) => { emit('update:active', val) }}
        list={props.list}
      />
      <div class={'dr-configure-container'} >
        <ElScrollbar>
          <div style={'padding: 0 12px;'}>
            {slots.default()}
          </div>
        </ElScrollbar>
      </div>
    </>
  }
}
