import {
  h,
  ref,
  defineComponent,
  computed,
  reactive,
  provide,
  ComputedRef,
  Slot,
  VNode,
  RendererNode,
  RendererElement
} from 'vue'
import { ElTable, ElTableColumn, ElRadio, ElTooltip, ElIcon } from 'element-plus'
import TableSelectionColumn from './table-column-selection'
import {
  isNotEmpty,
  isEmpty,
  isArray,
  getUsingConfig,
  getFieldValue,
  setFieldValue,
  cipTableKey,
  useCipConfig,
  useCipPageConfig, type IAnyObject, type ITableColumnConfig
} from '@d-render/shared'
// @ts-ignore
import { CipButtonCollapse, CipButtonText } from '@xdp/button'
import { tableProps, type TTableProps } from './table-props'
import ColumnInput from './column-input'
import { EmptyStatus, Hint } from './icons-vue'
import { dateColumnWidthMap, handleColumnWidthMap, SizeCellConfigKey } from './config'
import { analyseData, getPropertyKeyByPath, calculateCurrentWidth } from './util'
type TComponentSize = 'small' | 'default' | 'large'
interface ITableRow {
  row: IAnyObject
  $index: number
  column: IAnyObject
}
export default defineComponent({
  name: 'CipTable',
  inheritAttrs: false,
  props: tableProps,
  emits: ['sort', 'update:data', 'update:selectColumns', 'mainFieldClick', 'update:selectRadio', 'row-click'],
  setup (props: TTableProps, context) {
    const cipConfig = useCipConfig()
    const cipPageConfig = useCipPageConfig()
    const cipTableRef = ref()
    // TODO: xdp 配置可控制更多的属性
    const tableUsingConfig = (key: string, defaultValue?: unknown) => {
      const configKey = `table.${key}`
      return getUsingConfig(
        getFieldValue(props, key),
        getFieldValue(cipPageConfig, configKey),
        getFieldValue(cipConfig, configKey),
        defaultValue
      )
    }

    const _size = computed(() => {
      return tableUsingConfig('size', 'default') as TComponentSize
    })

    const _border = computed(() => {
      return tableUsingConfig('border') as boolean
    })

    const showDisabledButtonBridge = computed(() => {
      return tableUsingConfig('showDisabledButton') as boolean
    })

    const dangerButtonBridge = computed(() => {
      return tableUsingConfig('dangerButton', false) as boolean
    })

    const _defaultAlign = computed(() => {
      return tableUsingConfig('defaultAlign', 'left') as 'left' | 'center' | 'right'
    })

    const calculateCurrentWidthFn: ComputedRef<(width: number)=> number> = computed(() => {
      const customTransform = cipConfig.table?.transformPx
      if (typeof customTransform === 'function') {
        return (width) => customTransform(width) + addBorderWidth.value
      }
      if (props.size) return (width) => width + addBorderWidth.value
      const { sizeStandard = 'default', size = 'default' } = (cipConfig.table || {}) as {
        sizeStandard: SizeCellConfigKey
        size: SizeCellConfigKey
      }
      // FEAT(2.0.3): 当border为true是会比默认的多+1
      return (width) => calculateCurrentWidth(size, sizeStandard, width) + addBorderWidth.value
    })

    const cipTable = reactive({
      size: _size,
      showDisabledButton: showDisabledButtonBridge,
      dangerButton: dangerButtonBridge
    })

    // 当前主要提供给cip-button-text使用
    provide(cipTableKey, cipTable)

    context.expose({
      cipTableRef
    })

    // table 数据更新 v-model:data
    const updateData = (val: IAnyObject, index: number) => {
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
    const onSortChange = ({ prop, order }: {prop: string, order: string}) => {
      context.emit('sort', { prop, order })
    }
    // 触发列的选中改变事件
    const onSelectionChange = (val: unknown) => {
      context.emit('update:selectColumns', val)
    }
    // 如果带上了border则所有列宽需要+1
    const addBorderWidth = computed(() => {
      return _border.value ? 1 : 0
    })
    // 原始的width 转换系数
    const transformWidth = (widthStr: string | number) => {
      const applyPx = calculateCurrentWidthFn.value
      if (typeof widthStr === 'number') return Math.ceil(applyPx(widthStr))
      if (widthStr.indexOf('px') > -1) return `${Math.ceil(applyPx(Number(widthStr.replace(/px$/, ''))))}px`
      return widthStr
    }
    // 渲染table的单个数据列 注意此处为Column
    const renderTableColumn = ({ key, config }: { key: string, config: Partial<ITableColumnConfig['config']> } = { key: '', config: {} }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, type, formatter, columnType, textLevel, ...tableColumnConfig } = config
      // date 类型 强行修改宽度
      if (!tableColumnConfig.width) {
        // 兼容历史老代码
        if (config.type === 'date' && config.viewType === 'datetime') {
          tableColumnConfig.width = dateColumnWidthMap[_size.value]
        }
      } else {
        tableColumnConfig.width = transformWidth(tableColumnConfig.width)
      }
      const headerSlots = ({ column, $index }: ITableRow) => {
        if (config.slots?.header) {
          return config.slots.header({ column, $index, config, key })
        }
        const result = [config.label]
        // 存在说明
        if (config.description) {
          const descriptionComp = (
            <ElTooltip effect={config.descriptionEffect as string || 'light'} placement={'top'}>
              {{
                content: () => config.description,
                default: () => <ElIcon style={''} class={'cip-table__header-hint'}>
                  <Hint/>
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
        return <div class={'cip-table__header-cell'}>{result}</div>
      }
      let dataIndexed: Record<number, Array<number>>
      if (props.rowKey) {
        dataIndexed = analyseData(props.data, props.treeProps)
      }
      // 【内置类型】: 目前仅支持checkbox
      if (columnType === 'checkbox') {
        const { trueLabel, falseLabel, selectable } = tableColumnConfig
        return <TableSelectionColumn
          trueLabel={trueLabel as string}
          falseLabel={falseLabel as string}
          selectable={selectable!}
          prop={key}
          data={props.data}
          label={config.label}
        />
      }

      const textLevelClass = textLevel
        ? `text-${textLevel}`
        : columnType === 'mainField' ? 'text-primary' : undefined

      return h(ElTableColumn, {
        prop: key,
        align: config.type === 'number' ? 'right' : _defaultAlign.value, // 针对数字类型进行居右优化
        style: 'display: flex;',
        className: textLevelClass,
        ...tableColumnConfig
      }, {
        header: headerSlots,
        default: ({ row, $index, column }: ITableRow) => {
          // if ($index === -1) return // 如果写上这个代码 children 将失效
          if (isArray(config.children) && config.children!.length > 0) {
            return renderTableColumns(config.children!)
          } else {
            if ($index < 0) return null
            // 同时开放key值插槽及key+'Slot' 的插槽
            // default/append/expand/_handler为table其他用途的插槽不可用于渲染column
            // 如果存在字段名为上述字段的，需要加Slot后缀，例： defaultSlot\appendSlot
            if (!['default', 'append', 'prepend', 'expand', '_handler', '$handler'].includes(key) && context.slots[key]) {
              return context.slots[key]!({ row, $index, column })
            }
            // 特殊字段插槽 ['default', 'append', 'expand', '_handler', '$handler']
            if (context.slots[`${key}Slot`]) {
              return context.slots[`${key}Slot`]!({ row, $index, column })
            }
            let propertyKey: string|number = $index

            if (dataIndexed) {
              const path = dataIndexed[$index]
              if (path) {
                propertyKey = path?.length > 1 ? getPropertyKeyByPath(path, props.treeProps) : path[0]
              }
            }
            const inputProps = {
              config, // 去除$render
              fieldKey: props.fieldKey || '',

              index: $index,
              model: row,
              key,
              tableRuleKey: props.ruleKey,
              propertyKey,
              columnKey: key,
              tableDependOnValues: props.dependOnValues,
              tableData: props.data,
              rowEdit: props.editType === 'row' ? editRowIdx.value === $index : true,
              updateData
            }
            // __render的优先级高于普通的type
            if (typeof config.__render === 'function') {
              return config.__render({ ...inputProps, row, $index, $position: 'table' })
            }
            if (columnType === 'mainField') {
              return h(CipButtonText, {
                onClick: () => {
                  context.emit('mainFieldClick', { row, $index })
                }
                // @ts-ignore
              }, () => h(ColumnInput, inputProps))
            }
            // @ts-ignore
            return h(ColumnInput, inputProps)
          }
        }
      })
    }

    const editRowIdx = ref(-1)
    const handlerOutClick = () => {
      editRowIdx.value = -1
      document.removeEventListener('click', handlerOutClick)
    }
    const onRowClick = (row: any, column: any, event: Event) => {
      if (event) {
        event.stopPropagation()
      }
      document.addEventListener('click', handlerOutClick)
      const idx = props.data.findIndex(v => v === row)
      editRowIdx.value = idx
      context.emit('row-click', row, column, event)
    }
    // 渲染table的所有数据列 注意此处为Columns
    const renderTableColumns = (columns: Array<ITableColumnConfig> = []) => {
      if (!isArray(columns)) {
        throw new Error('function renderTableColumns param columns must be array')
      }
      return columns.filter(column => !column.config.hideItem).map(column => renderTableColumn(column))
    }
    // 渲染table所有列 操作、选中、序号等
    const TableColumns = () => {
      // table字段渲染
      const slots: Array<
        VNode<RendererNode, RendererElement, { [props:string]: unknown}>
        |Array<VNode<RendererNode, RendererElement, {[props:string]: unknown}>>
      > = renderTableColumns(props.columns)
      // 序号渲染
      if (isNotEmpty(props.offset) && props.offset! > -1 && !props.hideIndex) {
        const indexColumn = h(ElTableColumn, {
          label: props.seqLabel || '序号',
          fixed: props.indexFixed ? 'left' : '',
          align: _defaultAlign.value,
          width: transformWidth(isEmpty(props.rowKey) ? 55 : 75)
        },
        {
          default: ({ $index }: ITableRow) => `${$index + 1 + props.offset!}`
        })
        slots.unshift(indexColumn)
      }
      // 复选框
      if (props.selectType === 'checkbox') {
        const option: {type: 'selection', width: string, fixed: string, selectable?: (row:IAnyObject, index:number)=> boolean} = {
          type: 'selection',
          width: transformWidth(45) as string,
          fixed: 'left'
        }
        if (isNotEmpty(props.selectable)) { // 选择
          option.selectable = (row, index) => props.selectable!(row || {}, index)
        }
        const selectionColumn = h(ElTableColumn, option)
        slots.unshift(selectionColumn)
      }
      // 单选框
      if (props.selectType === 'radio') {
        const selectionColumn = h(ElTableColumn, { width: transformWidth(45), fixed: 'left' }, {
          default: ({ row }: ITableRow) => h(ElRadio, {
            label: ((props.selectLabel && row[props.selectLabel]) ?? row.id) as string | number,
            modelValue: props.selectRadio,
            'onUpdate:modelValue': (val) => context.emit('update:selectRadio', val),
            disabled: props.selectable && !props.selectable(row)
          }, { default: () => '' })
        })
        slots.unshift(selectionColumn)
      }
      // 展开
      if (context.slots.expand) {
        const expendColumn = h(ElTableColumn, { type: 'expand', width: transformWidth(32), fixed: 'left' }, {
          default: ({ row, index }: ITableRow & {index: number}) => context.slots.expand!({ row, index })
        })
        slots.unshift(expendColumn)
      }
      // jsx编译时有时候会去除_handler插槽
      // 注意_handler即将废弃请使用$handler代替
      if (props.withTableHandle && (context.slots._handler || context.slots.$handler)) {
        const handlerSlot = (context.slots._handler || context.slots.$handler) as Slot
        const handlerColumn = h(ElTableColumn, {
          label: '操作',
          fixed: 'right',
          align: props.handlerAlign ?? _defaultAlign.value,
          headerAlign: props.handlerHeaderAlign,
          width: props.handlerWidth
            ? transformWidth(props.handlerWidth)
            : handleColumnWidthMap[_size.value] + addBorderWidth.value
        }, {
          default: ({ row, $index }: ITableRow) => h(CipButtonCollapse, { limit: props.handlerLimit, row }, {
            default: () => handlerSlot({ row, $index })
          })
        })
        slots.push(handlerColumn)
        // 内部组件必须使用cip-table-button
      }
      // el-table组件提供的默认插槽
      if (context.slots.default) {
        slots.push(context.slots.default!())
      }
      // el-table组件提供的prepend插槽
      if (context.slots.prepend) {
        const prependSlots = context.slots.prepend!()
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
      border={_border.value}
      data={props.data}
      height={props.height}
      rowKey={props.rowKey}
      treeProps={props.treeProps}
      defaultExpandAll={props.defaultExpendAll}
      onSort-change={onSortChange}
      onSelection-change={onSelectionChange}
      onRow-click={onRowClick}
    >
      {{
        default: () => TableColumns(),
        empty: () => <EmptyBlock/>
      }}
    </ElTable>
  }
})
