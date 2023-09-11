import { CipForm } from 'd-render'

export default {
  props: {
    schema: {}
  },
  setup (props, { slots }) {
    return () => <CipForm labelPosition={'top'} class="dr-draw-table--form ">
      <div class={`dr-draw-table--container ${props.schema.indexFixed ? '' : 'is-index-fixed'}`}>
        {
          props.schema.hideIndex && <div class="dr-draw-table--seq">
            <div class="dr-draw-table--seq__title">序号</div>
            <div class="dr-draw-table--seq__number">1</div>
          </div>
        }
        <div class={`dr-draw-table--content ${props.schema.hideBorder ? '' : 'is-hide-border'}`}>
          {slots.default?.()}
        </div>
      </div>
      {
        props.schema.showSummary && <div class="dr-draw-table--summary">
          总计
        </div>
      }
    </CipForm>
  }
}
