import CipPageLayoutInfo from '@cip/page-layout/info'
import { CipForm } from 'd-render'
import { infoFieldList } from './config'
export default {
  props: {
    info: {}
  },
  setup (props) {
    return () => <CipPageLayoutInfo>
      <CipForm model={props.info} fieldList={infoFieldList} border={false} showOnly={true}/>
    </CipPageLayoutInfo>
  }
}
