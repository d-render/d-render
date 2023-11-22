import { ElTableColumn, ElCheckbox } from 'element-plus'
import { ref, computed, watch, defineComponent, PropType } from 'vue'
import { getFieldValue, IAnyObject, setFieldValue } from '@d-render/shared'
// 放弃通过provide获取数据的方案，el-table可能会变更此值的位置
interface ITableRow {
  row: IAnyObject
  $index: number
}

type SimpleModelValue = number | string | boolean | undefined

export default defineComponent({
  props: {
    prop: { type: String, required: true },
    label: String,
    trueLabel: [String, Number], // 不写就是默认的true
    falseLabel: [String, Number], // 不写就是默认的false
    selectable: { type: Function as PropType<(params:{ row: IAnyObject, index: number })=> boolean>, required: true },
    data: { type: Array as PropType<Array<IAnyObject>>, required: true } // cip-table内置时直接使用 如果不存在时降级从data elTable中获取
  },
  setup (props) {
    // const elTable = inject(TABLE_INJECTION_KEY)
    const isIndeterminate = ref()
    const allSelected = ref(false)
    // 此处数据变化不会导致allSelected的数据更新 需要使用watch
    const dataBridge = computed(() => props.data /* ?? elTable.ctx.data */) // [{ tableSelection: true }, { tableSelection: false }]

    watch(dataBridge, (val) => {
      if (!val || val.length === 0) allSelected.value = false
      val = val! // 断言val是存在的
      if (props.selectable !== undefined) {
        val = val.filter((v, i) => props.selectable({ row: v, index: i }))
      }
      if (!val.some(v => ([false, undefined, null] as unknown[]).includes(getFieldValue(v, props.prop)))) {
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
    const handleHeaderCheck = (val: boolean) => {
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
        header: () => <div class={'cip-table-column-selection'}>
          <ElCheckbox
            modelValue={allSelected.value}
            onUpdate:modelValue={(val) => { handleHeaderCheck(val as boolean) }}
            indeterminate={isIndeterminate.value}
          />
          {props.label}
        </div>,
        default: ({ row, $index }: ITableRow) => <ElCheckbox
          modelValue={getFieldValue(row, props.prop) as SimpleModelValue}
          disabled={props.selectable && !props.selectable({ row, index: $index })}
          onUpdate:modelValue={(val) => setFieldValue(row, props.prop, val)}
        />
      }}
    </ElTableColumn>
  }
})
