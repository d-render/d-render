import CipPageLayoutList from '@cip/components/page-layout/list'
import { isArray } from '@cip/utils/util'
import { computed } from 'vue'
export default {
  props: {
    config: {}
  },
  setup (props, context) {
    const componentSlots = computed(() => {
      const { slotsConfig } = props.config
      return Object.keys(props.config.slotsConfig || {}).reduce((acc, key) => {
        if (isArray(slotsConfig[key])) {
          acc[key] = () => context.slots.item({ children: slotsConfig[key], isShow: props.config._isShow })
        }
        return acc
      }, {})
    })
    return () => {
      const { slotsConfig, ...attr } = props.config
      return <CipPageLayoutList {...attr} v-slots={componentSlots.value} />
    }
  }
}
