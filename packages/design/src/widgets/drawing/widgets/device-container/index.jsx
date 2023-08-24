import IphoneSix from "./mobile/iphone-six";
export default {
  props: {
    equipment: {
      type: String,
      default: "pc",
    },
    deviceType: {
      type: String,
      default: "IphoneSix"
    }
  },
  setup(props, { slots }) {
    const mapComponents = {
      IphoneSix
    }
    const comp = mapComponents[props.deviceType]
    const mobileContainer = <comp>{
    slots?.default()
    }</comp>
    const pcContainer = <>{slots?.default()}</>;
    return () => <>
    {
      props.equipment === 'pc' ? pcContainer : mobileContainer
    }
    </>;
  },
};
