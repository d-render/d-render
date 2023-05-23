import { ElTableColumn, ElCheckbox } from 'element-plus'
// import { TABLE_INJECTION_KEY } from 'element-plus/es/components/table/src/tokens'
import { ref, computed, /* inject, */ watch } from 'vue'
import { getFieldValue, setFieldValue } from '@d-render/shared'
// 放弃通过provide获取数据的方案，el-table可能会变更此值的位置
export default {
  props: {
    prop: String,
    label: String,
    trueLabel: [String, Number], // 不写就是默认的true
    falseLabel: [String, Number], // 不写就是默认的false
    selectable: Function,
    data: Array // cip-table内置时直接使用 如果不存在时降级从data elTable中获取
  },
  setup (props) {
    // const elTable = inject(TABLE_INJECTION_KEY)
    const isIndeterminate = ref()
    const allSelected = ref(false)
    // 此处数据变化不会导致allSelected的数据更新 需要使用watch
    const dataBridge = computed(() => props.data /* ?? elTable.ctx.data */) // [{ tableSelection: true }, { tableSelection: false }]

    watch(dataBridge, (val) => {
      if (props.selectable) {
        val = val.filter((v, i) => props.selectable({ row: v, index: i }))
      }
      if (!val || val.length === 0) allSelected.value = false
      if (!val.some(v => [false, undefined, null].includes(getFieldValue(v, props.prop)))) {
        allSelected.value = true
        isIndeterminate.value = false
      } else if (val.some(v => getFieldValue(v, props.prop) === true)) {
        // 非全选中，但选中了
        isIndeterminate.value = true
        allSelected.value = false
      } else {
        isIndeterminate.value = false
        allSelected.value = false
      }
    }, { deep: true })
    const handleHeaderCheck = (val) => {
      const selectableData = dataBridge.value.filter((v, i) => props.selectable({ row: v, index: i }))
      if (val) {
        selectableData.forEach(v => {
          setFieldValue(v, props.prop, true)
        })
      } else {
        selectableData.forEach(v => {
          setFieldValue(v, props.prop, false)
        })
      }

      // allSelected.value = val
    }
    // 如何获取data
    return () => <ElTableColumn align={'center'}>
      {{
        header: ({ column, $index }) => <div class={'cip-table-column-selection'}>
          <ElCheckbox
            modelValue={allSelected.value}
            onUpdate:modelValue={(val) => handleHeaderCheck(val)}
            indeterminate={isIndeterminate.value}
          />
          {props.label}
        </div>,
        default: ({ row, $index }) => <ElCheckbox
          modelValue={getFieldValue(row, props.prop)}
          disabled={props.selectable && !props.selectable({ row, index: $index })}
          onUpdate:modelValue={(val) => setFieldValue(row, props.prop, val)}
        />
      }}
    </ElTableColumn>
  }
}
