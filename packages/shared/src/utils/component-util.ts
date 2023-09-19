interface IPropScheme{
  attr?: boolean
  type?: unknown
  default?: unknown
  options?: Array<unknown>
  validate?: (val: unknown)=> boolean
}
interface IEventSchema{

}
interface IComponentScheme {
  propsScheme: Record<string, IPropScheme>
  eventsScheme: Record<string, IEventSchema>
}

// 从scheme获取组件props
export const generateProps = (componentScheme: IComponentScheme) => {
  if (componentScheme.propsScheme) {
    const props: IComponentScheme['propsScheme'] = {}
    Object.keys(componentScheme.propsScheme).forEach(propKey => {
      const propScheme = componentScheme.propsScheme[propKey]
      if (!propScheme.attr) {
        const prop: IPropScheme = {}
        const { type, default: defaultValue, options, validate } = propScheme
        if (type) prop.type = type
        prop.default = defaultValue
        if (options && validate) prop.validate = (val) => options.includes(val)
        props[propKey] = prop
      }
    })
    return props
  } else {
    return {}
  }
}

// 从scheme获取组件emits
export const generateEmits = (componentScheme: IComponentScheme) => {
  if (componentScheme.eventsScheme) {
    return Object.keys(componentScheme.eventsScheme).reduce((acc: Record<string, unknown>, emitKey) => {
      acc[emitKey] = {}
      return acc
    }, {})
  } else {
    return []
  }
}
