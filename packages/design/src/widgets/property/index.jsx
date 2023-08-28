import ConfigTabs from './config-tabs/config-tabs'
import FieldConfig from './property/field-config'
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
    return () => <div>
      <ConfigTabs
        active={props.active}
        onUpdate:active={(val) => { emit('update:active', val) }}
        list={props.list}
      />
      <div style={'padding: 0 12px;'}>
        {slots.default()}
      </div>
    </div>
  }
}
