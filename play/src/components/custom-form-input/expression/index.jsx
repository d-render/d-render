import { ref } from 'vue'
import { ElTooltip } from 'element-plus'
import { formInputProps, fromInputEmits, useFormInput } from '@d-render/shared'
import { CipButton } from '@xdp/button'
import CipDialog from '@cip/components/cip-dialog'
import CipInput from '@cip/components/cip-input'
import FxIcon from './components/fx-icon.vue'
import ExpressionConfig from './components/expression-config'

export default {
  props: formInputProps,
  emits: [...fromInputEmits],
  setup (props, ctx) {
    const { proxyValue } = useFormInput(props, ctx)

    const visible = ref(false)
    const open = () => {
      visible.value = true
    }

    const expRef = ref()
    const onConfirm = (resolve, reject) => {
      try {
        const ret = expRef.value.resolveData()
        proxyValue.value = ret
        resolve()
      } catch (error) {
        console.error(error)
        reject()
      }
    }

    return () => <>
      <CipInput v-model={proxyValue.value}>
        {{
          append: () => (
            <ElTooltip
              content="点击配置表达式"
              placement="left"
              effect="dark"
            >
              <CipButton onClick={open}><FxIcon /></CipButton>
            </ElTooltip>
          )
        }}
      </CipInput>
      <CipDialog
        title="表达式配置"
        width="840px"
        v-model={visible.value}
        onConfirm={onConfirm}
      >
        <ExpressionConfig ref={expRef} modelValue={proxyValue.value} />
      </CipDialog>
    </>
  }
}
