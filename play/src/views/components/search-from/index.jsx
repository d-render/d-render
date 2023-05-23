import BaseDescription from '../widgets/base'
import data from './data'
export default {
  setup () {
    return () => <BaseDescription info={data}/>
  }
}
