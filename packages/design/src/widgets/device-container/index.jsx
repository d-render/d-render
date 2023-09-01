import IphoneSix from './mobile/iphone-six'
import Pc from './pc'
import { computed } from 'vue'
import { useNamespace } from '@d-render/shared'

export default {
  props: {
    type: String,
    equipment: {
      type: String,
      default: 'pc'
    },
    deviceType: {
      type: String,
      default: 'IphoneSix'
    }
  },
  setup (props, { slots }) {
    const mapComponents = {
      IphoneSix
    }
    const Wrapper = computed(() => {
      if (props.equipment === 'pc') {
        return Pc
      }
      return mapComponents[props.deviceType] ?? mapComponents.IphoneSix
    })
    const ns = useNamespace('device-container')
    return () => <div class={[ns.b(), ns.m(props.type)]}>
      <Wrapper.value>{slots.default?.()}</Wrapper.value>
    </div>
  }
}
