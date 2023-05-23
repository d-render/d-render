import { computed, defineComponent } from 'vue'
import { formInputViewProps, fromInputEmits, useFormView } from '@d-render/shared'
import TextareaDirectives from '@cip/components/directives/textarea'
export default defineComponent({
  props: formInputViewProps,
  emits: [...fromInputEmits],
  directives: {
    [TextareaDirectives.name]: TextareaDirectives
  },
  setup (props) {
    const { securityConfig } = useFormView(props)
    const fontWeight = computed(() => {
      return securityConfig.value.fontWeight ?? 'normal'
    })
    const fontSize = computed(() => {
      return securityConfig.value.fontSize + 'px' ?? '14px'
    })
    const textAlign = computed(() => {
      return securityConfig.value.textAlign ?? 'left'
    })
    return () => (
      <div
        id={props.fieldKey}
        style={{
          lineHeight: 'normal',
          width: '100%',
          ...(securityConfig.value.inputStyle || {}),
          fontWeight: fontWeight.value,
          fontSize: fontSize.value,
          textAlign: textAlign.value
        }}
        v-textarea={securityConfig.value.staticInfo}/>
    )
  }
})
