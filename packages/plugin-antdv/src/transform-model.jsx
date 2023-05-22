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
      return <div>
        <Comp
          {...attrs}
          value={props.modelValue}
          onUpdate:value={emitValue}
        />
      </div>
    }
  }
}
