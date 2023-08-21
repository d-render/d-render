<template>
  <div :class="ns.b()" v-if="group.components.length>0">
    <div :class="ns.e('label')">
      {{group.label}}
    </div>
<!--    <ul class="component-group__list">-->
    <vue-draggable :model-value="group.components"
                   item-key="type"
                   tag="ul"
                   :group="{name: 'components', pull: 'clone', put:false}"
                   :sort="false"
                   :clone="cloneComponent">
      <template #item="{element}">
        <form-component-item :item="element" @click="addComponent(element)"></form-component-item>
      </template>
    </vue-draggable>
<!--    </ul>-->
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import VueDraggable from 'vuedraggable'
import FormComponentItem from './item'
import { getCopyRow, useNamespace } from '@d-render/shared'
export default defineComponent({
  components: { VueDraggable, FormComponentItem },
  props: {
    group: Object
  },
  emits: ['add'],
  setup (props, { emit }) {
    const ns = useNamespace('component-group')
    const cloneComponent = (component) => {
      const { icon, ...config } = component
      // // 排除自身的icon
      return getCopyRow({ config })
    }
    const addComponent = (component) => {
      emit('add', cloneComponent(component))
    }
    return {
      ns,
      cloneComponent,
      addComponent
    }
  }
})
</script>
