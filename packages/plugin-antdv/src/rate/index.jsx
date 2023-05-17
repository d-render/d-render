import { CipFormInputTransform } from 'd-render'
import { Rate } from 'ant-design-vue'
export default {
  name: 'AntRate',
  setup () {
    return () => <CipFormInputTransform comp={Rate}/>
  }
}
