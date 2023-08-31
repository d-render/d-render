import { useNamespace } from '@d-render/shared'
export default {
  setup (props, { slots }) {
    const ns = useNamespace('design-device')
    return () => (
      <div class={[ns.b(), ns.m('pc')]} >
        {slots.default?.()}
      </div>
    )
  }
}
