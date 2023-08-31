import { layoutProps } from '@d-render/shared'
import { CipForm } from 'd-render'
import { useComponentSlots } from '@d-render/design/esm/hooks/use-component-slots'
import './index.less'
export default {
  props: layoutProps,
  setup (props, context) {
    const { componentSlots } = useComponentSlots(props, context)
    // fieldList 存放地址 options.value[0].children
    return () => {
      return <CipForm fieldList={[]}>
        <div class="table-design-wrapper">
          <div class="table-design-content">
            {componentSlots.value.default?.()}
          </div>
        </div>
      </CipForm>
    }
  }
}
