import { defineComponent, withModifiers } from 'vue'

export default defineComponent({
  props: {
    name: String,
    isActive: Boolean
  },
  emits: ['onClick'],
  setup (props, { emit }) {
    const emitClick = () => {
      emit('onClick', props.name)
    }

    return () => (
      <div
        class={['config-tab', { 'config-tab--active': props.isActive }]}
        onClick={withModifiers(emitClick, ['stop'])}
      >
        <slot></slot>
      </div>
    )
  }
})
