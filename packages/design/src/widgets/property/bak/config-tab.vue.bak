<template>
  <div class="config-tab" :class="{'config-tab--active':isActive}" @click="emitClick">
    <slot></slot>
  </div>
</template>
<script>

export default {
  props: {
    name: String,
    isActive: Boolean
  },
  emits: ['onClick'],
  setup (props, { emit }) {
    const emitClick = () => {
      emit('onClick', props.name)
    }
    return {
      emitClick
    }
  }
}
</script>
