import { DrFormDesign } from '@d-render/design'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './config'
export default {
  setup () {
    return () => <PlInfo>
      <DrFormDesign style={'background: #fff'} componentsGroupList={componentsGroupList}/>
    </PlInfo>
  }
}
