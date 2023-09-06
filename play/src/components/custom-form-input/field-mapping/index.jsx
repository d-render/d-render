import { ref, watch } from 'vue'
import { formInputProps, fromInputEmits, useFormInput } from '@d-render/shared'
// import CipInput from '@cip/components/cip-input'
import CipSelect from '@cip/d-render-plugin-cci/input/basic/select'
import CipMessage from '@cip/components/cip-message'
import { CipButtonText } from '@xdp/button'
import CipDialog from '@cip/components/cip-dialog'
import './index.less'

export default {
  props: formInputProps,
  emits: [...fromInputEmits],
  setup (props, ctx) {
    const {
      // securityConfig,
      proxyValue,
      proxyOtherValue
    } = useFormInput(props, ctx, { maxOtherKey: 3 })

    const list = ref([])
    const getList = () => {
      list.value = proxyOtherValue[0].value?.list.map(item => ({
        ...item.config,
        label: `${item.config.label} (${item.config.key})`
      })) ?? []
    }
    getList()

    const ds = ref(['name', 'age', 'id', 'gender'])
    watch(() => proxyOtherValue[1].value, val => {
      // TODO: 根据数据源获取字段数据
    }, { immediate: true })

    const visible = ref(false)
    const open = () => {
      if (!proxyOtherValue[1].value) {
        CipMessage.warning('请先选择数据源')
        return
      }
      visible.value = true
    }

    const onConfirm = (resolve, reject) => {
      try {
        const ret = []
        const otherKeys = []
        list.value.forEach(item => {
          if (item.fieldKey && item.sourceKey) {
            ret.push({
              fieldKey: item.fieldKey,
              sourceKey: item.sourceKey
            })
            otherKeys.push(item.fieldKey)
          }
        })
        proxyValue.value = ret
        // updateStream.appendOtherValue(otherKeys, 3)
        // updateStream.end()
        resolve()
      } catch (error) {
        reject(error)
      }
    }

    return () => <>
      <CipButtonText onClick={open}>配置</CipButtonText>
      <CipDialog
        title="字段映射"
        v-model={visible.value}
        onConfirm={onConfirm}
      >
        {
          list.value.map((item, index) => {
            return <div key={index} class="mapping-item">
              <CipSelect
                v-model={item.fieldKey}
                config={{
                  options: [...list.value],
                  optionProps: { value: 'key', label: 'label' }
                }}></CipSelect>
              <div class="mapping-item-sign"> -&gt; </div>
              <CipSelect
                v-model={item.sourceKey}
                config={{
                  options: [...ds.value]
                }}></CipSelect>
            </div>
          })
        }
      </CipDialog>
    </>
  }
}
