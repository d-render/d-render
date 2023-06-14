import { CipSearchForm, CipFormInputTransform } from 'd-render'
import { inject } from 'vue'
export default {
  emits: ['update:modelValue'],
  setup () {
    const searchFromProps = [
      'fieldList',
      'hideSearch',
      'handleAbsolute',
      'collapse',
      'searchButtonText',
      'searchReset',
      'grid',
      'equipment',
      'labelPosition',
      'completeRow',
      'defaultModel',
      'search'
    ]
    const cipFormRender = inject('cipFormRender', {})
    const TransformModelSearchForm = (props, { emit }) => {
      const { modelValue = {}, dataBus, search, ...componentProps } = props
      return <CipSearchForm
        {...componentProps}
        model={modelValue}
        onUpdate:model={componentProps['onUpdate:modelValue']}
        onSearch={() => {
          const method = cipFormRender.methods[search]
          if (method) method()
          // cipFormRenderMethod.page()
          // search(dataBus, modelValue)
        }}
      />
    }

    return () => <CipFormInputTransform
      inputPropsConfig={searchFromProps}
      comp={TransformModelSearchForm}
    />
  }
}
