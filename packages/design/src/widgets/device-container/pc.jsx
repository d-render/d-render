import { useNamespace } from '@d-render/shared'
export default {
  setup (props, { slots }) {
    const ns = useNamespace('device')
    return () => (
      <div class={[ns.b(), ns.m('pc')]} >
        {slots.default?.()}
      </div>
    )
  }
}
