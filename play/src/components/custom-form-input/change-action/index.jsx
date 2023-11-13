import { ref } from 'vue'
import { formInputProps, fromInputEmits, useFormInput } from '@d-render/shared'
import { CipButtonText } from '@xdp/button'
import CipDialog from '@cip/components/cip-dialog'
import Flow from './components/flow'
import './index.less'

export default {
  props: formInputProps,
  emits: [...fromInputEmits],
  setup (props, ctx) {
    // otherKey: ['key', 'type']
    const { proxyValue, proxyOtherValue } = useFormInput(props, ctx, { maxOtherKey: 2 })
    const visible = ref(false)
    const open = () => {
      visible.value = true
    }

    const flowRef = ref()
    const onConfirm = (resolve, reject) => {
      try {
        const ret = flowRef.value.resolveData()
        proxyValue.value = ret
        resolve()
      } catch (error) {
        console.error(error)
        reject()
      }
    }

    return () => <>
      <CipButtonText onClick={open}>配置</CipButtonText>
      <CipDialog
        title="配置动作"
        dialogType="drawer"
        width="80%"
        v-model={visible.value}
        onConfirm={onConfirm}
      >
        <Flow
          ref={flowRef}
          data={proxyValue.value}
          fieldKey={proxyOtherValue[0].value}
          componentType={proxyOtherValue[1].value}
        ></Flow>
      </CipDialog>
    </>
  }
}
