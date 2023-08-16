import { CipFormInputTransform } from 'd-render'
import { ElTransfer } from 'element-plus'
export default {
  name: 'StandardDate',
  setup () {
    const elInputProps = [
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElTransfer}
    />
  }
}
