import { CipFormInputTransform } from 'd-render'
import { ElRate } from 'element-plus'
export default {
  name: 'StandardRate',
  setup () {
    return () => <CipFormInputTransform
      comp={ElRate}
    />
  }
}
