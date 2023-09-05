export default {
  setup (props, { slots }) {
    return () => <div class={['']}>
      <div style={{ height: '100%' }}>{slots.default?.()}</div>
    </div>
  }
}
