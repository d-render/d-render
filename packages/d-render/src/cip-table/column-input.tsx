import { computed, defineComponent, type PropType } from 'vue'
import CipFormItem from '../cip-form-item'
import type { IAnyObject, ITableColumnConfig } from '@d-render/shared'
export default defineComponent({
  name: 'ColumnInput',
  props: {
    config: { type: Object as PropType<ITableColumnConfig['config']>, required: true },
    fieldKey: { type: String },
    columnKey: String,
    index: { type: Number, required: true },
    model: Object as PropType<IAnyObject>,
    tableDependOnValues: Object as PropType<IAnyObject>,
    propertyKey: [String, Number],
    tableRuleKey: String,
    tableData: Array as PropType<Array<IAnyObject>>,
    updateData: {
      type: Function as PropType<(val: IAnyObject, index: number)=>void>,
      required: true
    },
    rowEdit: { type: Boolean, default: undefined }
  },
  setup (props) {
    const computedConfig = computed(() => {
      const config = { ...props.config } as ITableColumnConfig['config'] & { hideLabel?: boolean }
      config.width = '100%'
      config.hideLabel = true

      const writable = props.config.writable
      if (writable) {
        config.ruleKey = `${props.tableRuleKey}.${props.propertyKey}.${props.columnKey}`
      }
      if (!writable) {
        config.writable = false
        config.readable = true
        if (!config.dynamic) {
          config.dependOn = []
        }
      }
      return config
    })
    const fromItemProps = computed(() => {
      let { index, model, columnKey: fieldKey, tableDependOnValues, tableData, updateData } = props
      return {
        model, // 数据
        fieldKey, // 整合tableData对象的键值
        tableDependOnValues, // table data依赖数据
        tableData, // table的数据
        config: computedConfig.value, // 改变后的配置
        inTable: true, // 特殊标记
        rowEdit: props.rowEdit, // 行编辑(因为需要控制configConfig导致的编辑状态变化,所以只能交给DrFormItem处理)
        'onUpdate:model': (val: IAnyObject) => { // 更新数据
          model = val
          updateData(val, index)
        }
      }
    })

    return () => <CipFormItem style={'height: 30px;'} {...fromItemProps.value}/>
  }
})
