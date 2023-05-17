import { h, computed } from 'vue'
import CipFormItem from '../cip-form-item'
export default {
  name: 'ColumnInput',
  props: {
    config: Object,
    fieldKey: String,
    columnKey: String,
    index: Number,
    model: Object,
    tableDependOnValues: Object,
    propertyKey: [String,Number],
    tableRuleKey: String,
    tableData: Object,
    updateData: Function
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
        'onUpdate:model': (val) => { // 更新数据
          model = val
          updateData(val, index)
        }
      }
    })

    return () => h(CipFormItem, fromItemProps.value)
  }
}
