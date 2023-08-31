import IphoneSix from './mobile/iphone-six'
import Pc from './pc'
import { computed } from 'vue'

export default {
  props: {
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
    return () => <div class={'dr-design-device-container'}>
      <Wrapper.value>{slots.default?.()}</Wrapper.value>
    </div>
  }
}
