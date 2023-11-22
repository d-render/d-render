import { defineComponent, withModifiers } from 'vue'

export default defineComponent({
  props: {
    name: String
  },
  emits: ['onClick'],
  setup (props, { emit, slots }) {
    const emitClick = () => {
      emit('onClick', props.name)
    }

    return () => (
      <div onClick={withModifiers(emitClick, ['stop'])}>
         {slots.default?.()}
      </div>
    )
  }
})
