import { CipFormInputTransform } from 'd-render'
import { ElTimeSelect } from 'element-plus'
export default {
  name: 'StandardDate',
  setup () {
    const elInputProps = [
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElTimeSelect}
    />
  }
}
