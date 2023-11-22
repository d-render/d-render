import { computed } from 'vue'
import { CipFormInputTransform } from 'd-render'
import { ElCheckbox, ElCheckboxGroup, ElCheckboxButton } from 'element-plus'
const CheckBox = {
  setup (props, { attrs }) {
    const UComponent = computed(() => attrs.isButton ? ElCheckboxButton : ElCheckbox)
    return () => <ElCheckboxGroup>
      {attrs.options.map(option => {
        return <UComponent.value key={option.value} label={option.value}>{option.label}</UComponent.value>
      })}
    </ElCheckboxGroup>
  }
}
export default {
  name: 'StandardCheckbox',
  setup () {
    const elInputProps = [
      'isButton',
      'options',
      'size',
      'min',
      'max',
      'label',
      'text-color',
      'fill',
      'tag',
      'validateEvent'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={CheckBox}
    />
  }
}
