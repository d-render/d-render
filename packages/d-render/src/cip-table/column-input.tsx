import { computed, defineComponent, type PropType } from 'vue'
import CipFormItem from '../cip-form-item'
import type { IAnyObject, IRenderConfig } from '@d-render/shared'
export default defineComponent({
  name: 'ColumnInput',
  props: {
    config: { type: Object as PropType<IRenderConfig>, required: true },
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
    }
  },
  setup (props) {
    const computedConfig = computed(() => {
      const config = { ...props.config }
      config.width = '100%'
      config.hideLabel = true
      if (config.writable === true) {
        config.ruleKey = `${props.tableRuleKey}.${props.propertyKey}.${props.columnKey}`
      }
      if (!config.writable) {
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
        'onUpdate:model': (val: IAnyObject) => { // 更新数据
          model = val
          updateData(val, index)
        }
      }
    })

    return () => <CipFormItem {...fromItemProps.value}/>
  }
})
