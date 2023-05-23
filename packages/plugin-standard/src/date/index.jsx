import { CipFormInputTransform } from 'd-render'
import { ElDatePicker } from 'element-plus'
export default {
  name: 'StandardDate',
  setup () {
    const elInputProps = [
      ['inputType', 'type'],
      'readonly',
      'size',
      'editable',
      'clearable',
      'placeholder',
      'startPlaceholder',
      'endPlaceholder',
      'format',
      'popperClass',
      'popperOptions',
      'rangeSeparator',
      'defaultTime',
      'valueFormat',
      'id',
      'name',
      'unlinkPanels',
      'prefixIcon',
      'clearIcon',
      'validateEvent',
      'disabledDate',
      'shortcuts',
      'cellClassName',
      'teleported'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElDatePicker}
    />
  }
}
