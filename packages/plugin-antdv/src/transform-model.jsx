export default {
  name: 'TransformModel',
  props: {
    modelValue: {},
    comp: {}
  },
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup (props, { emit, attrs }) {
    const emitValue = (val) => {
      emit('update:modelValue', val)
    }
    return () => {
      const Comp = props.comp
      const {...compAttrs, style} = attrs
      return <div style={style}>
        <Comp
          {...compAttrs}
          value={props.modelValue}
          onUpdate:value={emitValue}
        />
      </div>
    }
  }
}
