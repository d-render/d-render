import { formConfigFieldConfigList } from '../config'
import { CipForm } from 'd-render'
export default {
  name: 'DrFormConfig',
  props: {
    schema: Object
  },
  setup (props) {
    return () => <CipForm
      labelPosition={'top'}
      model={props.schema}
      fieldList={formConfigFieldConfigList}
    />
  }
}
// <!--        <cip-form v-show="activeType === 'form'"-->
// <!--                  label-position="top"-->
// <!--                  :model="data"-->
// <!--                  @update:model="updateData"-->
// <!--                  :field-list="formConfigFieldConfigList"></cip-form>
