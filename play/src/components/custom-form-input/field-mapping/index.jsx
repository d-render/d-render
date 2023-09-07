import { computed, inject, ref, watch } from 'vue'
import { formInputProps, fromInputEmits, useFormInput } from '@d-render/shared'
import CipSelect from '@cip/d-render-plugin-cci/input/basic/select'
import CipMessage from '@cip/components/cip-message'
import { CipButtonText, CipButton } from '@xdp/button'
import CipDialog from '@cip/components/cip-dialog'
import { Plus, Close } from '@element-plus/icons-vue'
import './index.less'

export default {
  props: formInputProps,
  emits: [...fromInputEmits],
  setup (props, ctx) {
    /*
     * otherKey: ['api', 'key', 'otherKey']
     */
    const {
      proxyValue,
      updateStream,
      proxyOtherValue
    } = useFormInput(props, ctx, { maxOtherKey: 3 })
    const getSchema = inject('getSchema')
    const fieldKeyOptions = ref([])
    const getList = () => {
      const schema = getSchema()
      if (!proxyValue.value?.length) {
        proxyValue.value = [{
          fieldKey: '',
          sourceKey: ''
        }]
      }
      fieldKeyOptions.value = schema.list.map(item => {
        return {
          fieldKey: item.key,
          label: `${item.config.label} (${item.key})`
        }
      }) ?? []
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
        const selectedKeys = []
        proxyValue.value.forEach(item => {
          if (item.fieldKey && item.sourceKey) {
            ret.push(item)
            selectedKeys.push(item.fieldKey)
          }
        })
        proxyValue.value = ret
        updateStream.appendOtherValue(selectedKeys, 3)
        updateStream.end()
        resolve()
      } catch (error) {
        reject(error)
      }
    }

    const addOne = () => {
      proxyValue.value.push({
        fieldKey: '',
        sourceKey: ''
      })
    }
    const deleteItem = (index) => {
      proxyValue.value.splice(index, 1)
    }
    const disabled = computed(() => proxyValue.value.length >= fieldKeyOptions.value.length)

    return () => <>
      <CipButtonText onClick={open}>配置</CipButtonText>
      <CipDialog
        title="字段映射"
        v-model={visible.value}
        onConfirm={onConfirm}
      >
        {
          proxyValue.value.map((item, index) => {
            return <div key={index} class="mapping-item">
              <CipSelect
                v-model={item.fieldKey}
                config={{
                  options: [...fieldKeyOptions.value],
                  optionProps: { value: 'fieldKey', label: 'label', disabled: 'disabled' }
                }}></CipSelect>
              <div class="mapping-item-sign"> -&gt; </div>
              <CipSelect
                v-model={item.sourceKey}
                config={{
                  options: [...ds.value]
                }}></CipSelect>
              <div class="mapping-item-delete" onClick={() => deleteItem(index)}>
                <Close/>
              </div>
            </div>
          })
        }
        <div class="btn-add">
          <CipButton
            icon={Plus}
            onClick={addOne}
            disabled={disabled.value}
          />
        </div>
      </CipDialog>
    </>
  }
}
