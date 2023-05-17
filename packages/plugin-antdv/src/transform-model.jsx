export default {
  name: 'TransformModel',
  props: {
    modelValue: {},
    comp: {}
  },
  emits: ['update:modelValue'],
  setup (props, { emit, slots }) {
    const emitValue = (val) => {
      emit('update:modelValue', val)
    }
    return () => {
      const Comp = props.comp
      return <div>
        <Comp
          value={props.modelValue}
          onUpdate:value={emitValue}
        />
      </div>
    }
  }
}
