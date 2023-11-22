import { CipFormInputTransform } from 'd-render'
import { ElAutocomplete } from 'element-plus'
export default {
  name: 'StandardAutoComplete',
  setup () {
    const elInputProps = [
      'fetchSuggestions',
      'placeholder',
      'clearable',
      'valueKey',
      'debounce',
      'placement',
      'triggerOnFocus',
      'selectWhenUnmatched',
      'name',
      'label',
      'hideLoading',
      'popperClass',
      'teleported',
      'highlight-first-item',
      'fit-input-width'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElAutocomplete}
    />
  }
}
