export const propsScheme = {
  config: {
    type: Object,
    tsType: 'import(\'@d-render/shared\').IRenderConfig'
  },
  inputPropsConfig: {
    type: Array,
    tsType: 'import(\'@d-render/shared\').TKeyMap'
  },
  formInputOptions: {
    type: Object
  //   tsType: `{
  //   fromModelValue?: (val:any)=>any,
  //   toModelValue?: (val:any)=>any,
  //   maxOtherKey?: number
  // }`
  },
  comp: {
    type: Object
  }
}
export const eventsScheme = {

}
export const slotsScheme = {
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipFormInputTransform"
}
