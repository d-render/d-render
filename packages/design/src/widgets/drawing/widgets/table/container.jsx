import { h, computed, defineAsyncComponent } from 'vue'
import { useFormInject } from '@d-render/shared'
export default {
  setup (props, { slots }) {
    const cipForm = useFormInject()
    const Component = computed(() => {
      const mode = cipForm.equipment === 'mobile' ? 'mobile' : 'pc'
      return defineAsyncComponent(() => import(`./container-${mode}`))
    })
    return () => h(Component.value, props, slots)
  }

}
