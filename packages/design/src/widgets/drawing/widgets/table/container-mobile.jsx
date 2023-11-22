import { ElFormItem } from 'element-plus'
// import CipButtonText from '@cip/components/cip-button-text'
export default {
  props: {
    config: Object,
    hideDelete: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { slots }) {
    return () => {
      const config = props.config
      return <ElFormItem label={config.hideLabel === true ? '' : config.label} class={'table-design table-design--m'}>
        {!config.hideIndex && <div class="table-design__index">1</div>}
        {/* {!props.hideDelete && <div class={'table-design__handler'} style={{ width: '80px' }}> */}
        {/* <CipButtonText class={'table-design__insert'}> */}
        {/*  <i class="el-icon-circle-plus-outline cip-primary-color handler-size"/> */}
        {/* </CipButtonText> */}
        {/* <CipButtonText class={'table-design__delete'}> */}
        {/*  <i class="el-icon-remove-outline cip-danger-color handler-size"/> */}
        {/* </CipButtonText> */}
        {/* </div>} */}
        <div class="table-design__drag-wrapper">
          {slots.default?.()}
        </div>
      </ElFormItem>
    }
  }
}
