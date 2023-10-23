import { layoutProps } from '@d-render/shared'
import { TableDrawPlugin } from '@d-render/design/esm/plugins'
import { useComponentSlots } from '@d-render/design/esm/hooks/use-component-slots'
export default {
  props: layoutProps,
  setup (props, context) {
    const { componentSlots } = useComponentSlots(props, context)
    // fieldList 存放地址 options.value[0].children
    const Table = new TableDrawPlugin()
    return () => <Table.Component config={props.config}>
      {componentSlots.value.default?.()}
    </Table.Component>
  }
}
