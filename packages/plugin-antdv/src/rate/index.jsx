import { CipFormInputTransform } from 'd-render'
import TransformModel from '../transform-model'
import { Rate } from 'ant-design-vue'
export default {
  name: 'AntRate',
  setup () {
    return () => <CipFormInputTransform
      comp={<TransformModel comp={Rate} />}
    />
  }
}
