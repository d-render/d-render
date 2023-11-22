import { ref } from 'vue'
import { CipFormItem } from 'd-render'
import { drawingContentProps } from '../common-props'
import { useFieldDrawingItem } from '../use-field-drawing-item'
import { useNamespace } from '@d-render/shared'
export default {
  name: 'FormDrawingItem',
  inheritAttrs: false,
  props: drawingContentProps,
  emits: ['delete', 'copy'],
  setup (props, { emit, attrs }) {
    const ns = useNamespace('design-draw-content__item')

    const model = ref({})
    const { computedConfig, drawType } = useFieldDrawingItem({ props, emit })
    return () => (
      <>
        <div class={[ns.e('mask')]}/>
        <CipFormItem
          {...attrs}
          model={model.value}
          style={{
            width: computedConfig.value.width
          }}
          isDesign={true}
          drawType={drawType.value}
          onUpdate:model={(val) => { model.value = val }}
          fieldKey={props.fieldKey}
          formLabelPosition={props.formLabelPosition}
          config={computedConfig.value}
          showTemplate={true}
        />
      </>
    )
  }
}
