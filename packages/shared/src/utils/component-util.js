// 从scheme获取组件props
export const generateProps = (componentScheme) => {
  if (componentScheme.propsScheme) {
    const props = {}
    Object.keys(componentScheme.propsScheme).forEach(propKey => {
      const propScheme = componentScheme.propsScheme[propKey]
      if (!propScheme.attr) {
        const prop = {}
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
export const generateEmits = (componentScheme) => {
  if (componentScheme.eventsScheme) {
    return Object.keys(componentScheme.eventsScheme).reduce((acc, emitKey) => {
      acc[emitKey] = {}
      return acc
    }, {})
  } else {
    return []
  }
}
