<template>
  <li :class="[ns.b(), item.class]">
    <a>
      <i :class="[ns.e('icon'), item.icon]" />
      {{item.label}}
    </a>
  </li>
</template>
<script>
import { defineComponent } from 'vue'
import { useNamespace } from '@d-render/shared'
export default defineComponent({
  name: 'FormComponentItem',
  props: {
    item: Object
  },
  setup () {
    const ns = useNamespace('component-group-item')
    return {
      ns
    }
  }
})
</script>
