export default {
  setup (props, { slots }) {
    return () => (
      <div class="dr-design-drawing--device--container">
        <div class="mobile--sound"></div>
        <div class="mobile--receiver"></div>
        <div class="mobile--left-btn"></div>
        <div class="mobile--rigth-btn"></div>
        <div class="mobile-open-btn"></div>
        {slots.default?.()}
      </div>
    )
  }
}
