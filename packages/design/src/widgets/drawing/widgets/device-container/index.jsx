import IphoneSix from './mobile/iphone-six'
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
    const Comp = (props, { slots }) => {
      const _Comp = mapComponents[props.deviceType] ?? mapComponents.IphoneSix
      return <_Comp>{slots.default?.()}</_Comp>
    }

    return () => <>
    {
      props.equipment === 'pc'
        ? slots.default?.()
        : <Comp>{slots.default?.()}</Comp>
    }
    </>
  }
}
