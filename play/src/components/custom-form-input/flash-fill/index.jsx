import { computed, ref, withDirectives } from 'vue'
import { ElPopover, ElTable, ElTableColumn, ClickOutside } from 'element-plus'
import CipInput from '@cip/components/cip-input'
import { formInputProps, useFormInput } from '@d-render/shared'
import { throttle } from 'lodash-es'

export default {
  props: formInputProps,
  emits: ['update:modelValue', 'streamUpdate:model'],
  setup (props, ctx) {
    const otherKeyLength = props.config?.fieldMapping?.length ?? 10
    const {
      securityConfig,
      proxyValue,
      width,
      updateStream
    } = useFormInput(props, ctx, { maxOtherKey: otherKeyLength })

    const columns = computed(() => {
      return securityConfig.value.fieldMapping?.map?.(item => item?.sourceKey) ?? []
    })

    const list = ref([])
    const visible = ref(false)
    const update = async (p) => {
      // 数据源api -> securityConfig.value.api
      // TODO: 根据api调接口获取数据源数据
      const { data } = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { id: 1, name: 'name1', age: 18 },
              { id: 2, name: 'name2', age: 28 },
              { id: 3, name: 'name3', age: 38 }
            ]
          })
        }, 500)
      })
      list.value = data
      visible.value = list.value.length > 0
    }
    const onUpdate = throttle(update, 500)

    const selectRow = (row) => {
      const keys = securityConfig.value.otherKey
      keys.forEach((key, index) => {
        const sourceKey = securityConfig.value.fieldMapping.find(item => item.fieldKey === key)?.sourceKey
        if (securityConfig.value.key === key) {
          proxyValue.value = row[sourceKey]
        } else {
          updateStream.appendOtherValue(row[sourceKey], index + 1)
        }
      })
      updateStream.end()
      visible.value = false
    }

    return () => <>
      <ElPopover
        placement="bottom"
        visible={visible.value}
        width={width.value}
        teleported={false}
      >
        {{
          reference: () => <CipInput v-model={proxyValue.value} onUpdate:modelValue={onUpdate}></CipInput>,
          default: () => withDirectives(
            <ElTable data={list.value} onRowClick={selectRow}>
              {
                columns.value.map(col =>
                  <ElTableColumn
                    key={col}
                    prop={col}
                    label={col}
                  />
                )
              }
            </ElTable>,
            [[ClickOutside, () => { visible.value = false }]]
          )
        }}
      </ElPopover>
    </>
  }
}
