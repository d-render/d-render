import { CipForm } from 'd-render'

export default {
  setup (props, { slots }) {
    return () => <CipForm labelPosition={'top'}>
      <div class="dr-draw-table--container">
        <div class="dr-draw-table--seq">
          <div class="dr-draw-table--seq__title">序号</div>
          <div class="dr-draw-table--seq__number">1</div>
        </div>
        <div class="dr-draw-table--content">
          {slots.default?.()}
        </div>
      </div>
    </CipForm>
  }
}
