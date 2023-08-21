import { ElFormItem } from 'element-plus'
import { CipButtonText } from '@xdp/button'
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
      return (
        <ElFormItem label={config.hideLabel === true ? '' : config.label} class={'table-design table-design--pc'}>
          {!config.hideIndex && <div class="table-design__column table-design__column--index">
            <div class="table-design__column__label">序号</div>
            <div class="table-design__column__content">1</div>
          </div>}
          <div class="table-design__drag-wrapper">
            {slots.default?.()}
          </div>
          {!props.hideDelete && <div class="table-design__column table-design__column--operate">
            <div class="table-design__column__label">操作</div>
            <div class="table-design__column__content">
              <div>
                <CipButtonText>
                  <i class="el-icon-circle-plus-outline cip-primary-color handler-size"/>
                </CipButtonText>
                <CipButtonText>
                  <i class="el-icon-remove-outline cip-danger-color handler-size"/>
                </CipButtonText>
              </div>
            </div>
          </div>}
        </ElFormItem>
      )
    }
  }
}
