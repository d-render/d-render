import { h, ref, defineComponent, computed, reactive, provide } from 'vue'
import { ElTable, ElTableColumn, ElRadio, ElTooltip, ElIcon } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import TableSelectionColumn from './table-column-selection'
import {
  isNotEmpty,
  isEmpty,
  isArray,
  getUsingConfig,
  setFieldValue,
  cipTableKey,
  useCipConfig,
  useCipPageConfig
} from '@d-render/shared'
import { CipButtonCollapse } from '@xdp/button'
import { tableProps } from './table-props'
import ColumnInput from './column-input'
import { EmptyStatus } from './icons-vue'
import { dateColumnWidthMap, handleColumnWidthMap } from './config'
import { analyseData, getPropertyKeyByPath, calculateCurrentWidth } from './util'
export default defineComponent({
  name: 'CipTable',
  inheritAttrs: false,
  props: tableProps,
  emits: ['sort', 'update:data', 'update:selectColumns'],
  setup (props, context) {
    const cipConfig = useCipConfig()
    const cipPageConfig = useCipPageConfig()
    const cipTableRef = ref()
    const _size = computed(() => {
      // 考虑历史因素使用default作为默认值, 当前主要项目使用medium, 在修改表格size注意定宽项的折叠
      return getUsingConfig(props.size, cipConfig.table.size, 'default')
    })

    const _broder = computed(() => {
      return getUsingConfig(props.border, cipPageConfig.table?.border, cipConfig.table.border)
    })

    const calculateCurrentWidthFn = computed(() => {
      if (props.size) return (width) => width
      const { sizeStandard = 'default', size = 'default' } = cipConfig.table || {}
      return (width) => calculateCurrentWidth(size, sizeStandard, width)
    })

    const cipTable = reactive({
      size: _size
    })

    provide(cipTableKey, cipTable)
    context.expose({
      cipTableRef
    })

    // table 数据更新 v-model:data
    const updateData = (val, index) => {
      // 数据索引
      const dataIndexed = analyseData(props.data, props.treeProps)
      const path = dataIndexed[index]
      // 当存在tree是index与实际的不符合需要使用key进行唯一定位 或者遍历计数
      const propertyKey = getPropertyKeyByPath(path, props.treeProps)
      const data = props.data
      setFieldValue(data, propertyKey, val, true)
      // data[index] = val
      context.emit('update:data', data)
    }
    // 触发table的排序事件
    const onSortChange = ({ prop, order }) => {
      context.emit('sort', { prop, order })
    }
    // 触发列的选中改变事件
    const onSelectionChange = (val) => {
      context.emit('update:selectColumns', val)
    }
    // 原始的width 转换系数
    const transformWidth = (widthStr) => {
      if (typeof widthStr === 'number') return Math.ceil(calculateCurrentWidthFn.value(widthStr))
      if (widthStr.indexOf('px') > -1) return `${Math.ceil(calculateCurrentWidthFn.value(Number(widthStr.replace(/px$/, ''))))}px`
      return widthStr
    }
    // 渲染table的单个数据列 注意此处为Column
    const renderTableColumn = ({ key, config } = {}) => {
      const { children, type, formatter, columnType, ...tableColumnConfig } = config
      // date 类型 强行修改宽度
      if (!tableColumnConfig.width) {
        if (config.type === 'date' && config.viewType === 'datetime') {
          tableColumnConfig.width = dateColumnWidthMap[_size.value]
        }
      } else {
        tableColumnConfig.width = transformWidth(tableColumnConfig.width)
      }
      const headerSlots = ({ column, $index }) => {
        if (config.slots?.header) {
          return config.slots.header({ column, $index, config, key })
        }
        const result = [h('span', {}, [config.label])]
        // 存在说明
        if (config.description) {
          const descriptionComp = (
            <ElTooltip effect={config.descriptionEffect || 'light'} placement={'top'}>
              {{
                content: () => config.description,
                default: () => <ElIcon style={'margin-left:2px'}>
                  <InfoFilled />
                </ElIcon>
              }}
            </ElTooltip>
          )
          result.push(descriptionComp)
        }
        // 必填标记
        if (config.required === true && config.writable === true) {
          const requiredAsterisk = (<span class={['cip-danger-color']} style={{ marginRight: '4px' }}>*</span>)
          result.unshift(requiredAsterisk)
        }
        return result
      }
      let dataIndexed
      if (props.rowKey) {
        dataIndexed = analyseData(props.data, props.treeProps)
      }
      // 【内置类型】: 目前仅支持checkbox
      if (columnType === 'checkbox') {
        return <TableSelectionColumn
          {...tableColumnConfig}
          prop={key}
          data={props.data}
          label={config.label}
        />
      }
      return h(ElTableColumn, {
        prop: key,
        align: config.type === 'number' ? 'right' : '', // 针对数字类型进行居右优化
        style: 'display: flex;',
        ...tableColumnConfig
      }, {
        header: headerSlots,
        default: ({ row, $index, column }) => {
          // if ($index === -1) return // 如果写上这个代码 children 将失效
          if (isArray(config.children) && config.children.length > 0) {
            return renderTableColumns(config.children)
          } else {
            if ($index < 0) return null
            // 同时开放key值插槽及key+'Slot' 的插槽
            // default/append/expand/_handler为table其他用途的插槽不可用于渲染column
            // 如果存在字段名为上述字段的，需要加Slot后缀，例： defaultSlot\appendSlot
            if (!['default', 'append', 'prepend', 'expand', '_handler', '$handler'].includes(key) && context.slots[key]) {
              return context.slots[key]({ row, $index, column })
            }
            // 特殊字段插槽 ['default', 'append', 'expand', '_handler', '$handler']
            if (context.slots[`${key}Slot`]) {
              return context.slots[`${key}Slot`]({ row, $index, column })
            }
            let propertyKey = $index

            if (dataIndexed) {
              const path = dataIndexed[$index]
              if (path) {
                propertyKey = path?.length > 1 ? getPropertyKeyByPath(path, props.treeProps) : path[0]
              }
            }
            return h(ColumnInput, {
              config,
              fieldKey: props.fieldKey,
              index: $index,
              model: row,
              key,
              tableRuleKey: props.ruleKey,
              propertyKey,
              columnKey: key,
              tableDependOnValues: props.dependOnValues,
              tableData: props.data,
              updateData
            })
          }
        }
      })
    }
    // 渲染table的所有数据列 注意此处为Columns
    const renderTableColumns = (columns = []) => {
      if (!isArray(columns)) {
        throw new Error('function renderTableColumns param columns must be array')
      }
      return columns.filter(column => !column.config.hideItem).map(column => renderTableColumn(column))
    }
    // 渲染table所有列 操作、选中、序号等
    const TableColumns = () => {
      // table字段渲染
      const slots = renderTableColumns(props.columns)
      // 序号渲染
      if (isNotEmpty(props.offset) && props.offset > -1 && !props.hideIndex) {
        const indexColumn = h(ElTableColumn, {
          label: '序号',
          fixed: props.indexFixed ? 'left' : '',
          width: transformWidth(isEmpty(props.rowKey) ? 55 : 75)
        },
        {
          default: ({ $index }) => `${$index + 1 + props.offset}`
        })
        slots.unshift(indexColumn)
      }
      // 复选框
      if (props.selectType === 'checkbox') {
        const option = { type: 'selection', width: transformWidth(45), fixed: 'left' }
        if (isNotEmpty(props.selectable)) { // 选择
          option.selectable = (row, index) => props.selectable(row || {}, index)
        }
        const selectionColumn = h(ElTableColumn, option)
        slots.unshift(selectionColumn)
      }
      // 单选框
      if (props.selectType === 'radio') {
        const selectionColumn = h(ElTableColumn, { width: transformWidth(45), fixed: 'left' }, {
          default: ({ row }) => h(ElRadio, {
            label: row[props.selectLabel] ?? row.id,
            modelValue: props.selectRadio,
            disabled: props.selectable && !props.selectable(row)
          }, { default: () => '' })
        })
        slots.unshift(selectionColumn)
      }
      // 展开
      if (context.slots.expand) {
        const expendColumn = h(ElTableColumn, { type: 'expand', width: transformWidth(32), fixed: 'left' }, {
          default: ({ row, index }) => context.slots.expand({ row, index })
        })
        slots.unshift(expendColumn)
      }
      // jsx编译时有时候会去除_handler插槽
      // 注意_handler即将废弃请使用$handler代替
      if (props.withTableHandle && (context.slots._handler || context.slots.$handler)) {
        const handlerSlot = context.slots._handler || context.slots.$handler
        const handlerColumn = h(ElTableColumn, {
          label: '操作',
          fixed: 'right',
          width: props.handlerWidth ? transformWidth(props.handlerWidth) : handleColumnWidthMap[_size.value]
        }, {
          default: ({ row, $index }) => h(CipButtonCollapse, { limit: props.handlerLimit, row }, {
            default: () => handlerSlot({ row, $index })
          })
        })
        slots.push(handlerColumn)
        // 内部组件必须使用cip-table-button
      }
      // el-table组件提供的默认插槽
      if (context.slots.default) {
        slots.push(context.slots.default())
      }
      // el-table组件提供的prepend插槽
      if (context.slots.prepend) {
        const prependSlots = context.slots.prepend()
        if (isArray(prependSlots)) {
          slots.unshift(...prependSlots)
        } else {
          slots.unshift(prependSlots)
        }
      }
      // el-table组件提供的append插槽
      if (context.slots.append) {
        const appendSlots = context.slots.append()
        if (isArray(appendSlots)) {
          slots.push(...appendSlots)
        } else {
          slots.push(appendSlots)
        }
      }
      // 给所有column加一个父亲
      if (props.tableHeaderLabel) return h(ElTableColumn, { label: props.tableHeaderLabel, align: 'center' }, { default: () => slots })
      return slots
    }
    // 数据为空时显示
    const EmptyBlock = () => {
      return <div class='cip-table__empty'>
        <EmptyStatus class='cip-table__empty__svg'/>
        <div class="cip-table__empty__text">暂无数据</div>
      </div>
    }

    // 渲染table
    return () => <ElTable
      ref={cipTableRef}
      size={_size.value}
      {...context.attrs}
      class={'cip-table'}
      border={_broder.value}
      data={props.data}
      height={props.height}
      rowKey={props.rowKey}
      treeProps={props.treeProps}
      defaultExpendAll={props.defaultExpendAll}
      onSortChange={onSortChange}
      onSelectionChange={onSelectionChange}
    >
      {{
        default: () => <TableColumns/>,
        empty: () => <EmptyBlock/>
      }}
    </ElTable>
  }
})
