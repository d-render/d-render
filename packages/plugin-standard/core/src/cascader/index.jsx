import { CipFormInputTransform } from 'd-render'
import { ElCascader } from 'element-plus'
export default {
  name: 'StandardCascader',
  setup () {
    const elInputProps = [
      'options',
      'props',
      'size',
      'placeholder',
      'clearable',
      'showAllLevels',
      'collapseTags',
      'collapseTagsTooltip',
      'separator',
      'filterable',
      'filterMethod',
      'debounce',
      'beforeFilter',
      'popperClass',
      'teleported',
      'tagType',
      'validateEvent'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElCascader}
    />
  }
}
