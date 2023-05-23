import { CipFormInputTransform } from 'd-render'
import TransformModel from '../transform-model'
import { Rate } from 'ant-design-vue'
export default {
  name: 'AntRate',
  setup () {
    const aInputProps = [
      'allowClear',
      'allowHalf',
      'autofocus',
      'character',
      'count',
      'tooltips'
    ]
    return () => <CipFormInputTransform
      inputPropsConfig={aInputProps}
      comp={<TransformModel comp={Rate} />}
    />
  }
}
