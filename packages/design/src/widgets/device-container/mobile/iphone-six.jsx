import { useNamespace } from '@d-render/shared'
export default {
  setup (props, { slots }) {
    const ns = useNamespace('device')
    return () => (
      <div class={[ns.b(), ns.m('ip6')]} >
        <div class={ns.e('sound')} ></div>
        <div class={ns.e('receiver')} ></div>
        <div class={ns.e('left-btn')} ></div>
        <div class={ns.e('right-btn')} ></div>
        <div class={ns.e('open-btn')} ></div>
        <div class={ns.e('screen')}>
          {slots.default?.()}
        </div>
      </div>
    )
  }
}
