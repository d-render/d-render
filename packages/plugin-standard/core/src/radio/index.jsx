import { CipFormInputTransform } from 'd-render'
import { ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus'
import { computed } from 'vue'
import OptionsComponents from '../widgets/options-component/index'
const Radio = {
  setup (props, { attrs }) {
    const UComponent = computed(() => attrs.isButton ? ElRadioButton : ElRadio)
    return () => <OptionsComponents
      group={ElRadioGroup}
      item={UComponent.value}
      options={attrs.options}
      optionProps={attrs.config?.optionProps}
      optionValueProp={'label'}
      optionConfig={{
        border: attrs.border
      }}
    />
  }
}

export default {
  name: 'StandardRadio',
  setup () {
    const elInputProps = [
      'options',
      'optionProps',
      'isButton',
      'border',
      'size',
      'text-color',
      'fill',
      'validateEvent',
      'label',
      'name',
      'id',
      'optionConfig'
    ]
    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={Radio}
    />
  }
}
