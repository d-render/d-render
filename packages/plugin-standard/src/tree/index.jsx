import { CipFormInputTransform } from 'd-render'
import { ElTree } from 'element-plus'
export default {
  name: 'StandardDate',
  setup () {
    const elInputProps = [
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElTree}
    />
  }
}
