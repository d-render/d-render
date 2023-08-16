import DesignLayout from '../widgets/layout'
import { useNamespace } from '@d-render/shared'
export default {
  setup () {
    const ns = useNamespace('form-design')
    return () => <DesignLayout class={[ns.b()]}>

    </DesignLayout>
  }
}
