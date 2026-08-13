import {
  h,
  ref,
  watch,
  onMounted,
  nextTick,
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
  useCipPageConfig,
  type IAnyObject,
  type ITableColumnConfig,
  type ITransformWidthOption
} from '@d-render/shared'
// @ts-ignore
import { CipButtonCollapse, CipButtonText } from '@xdp/button'
import { tableProps, type TTableProps } from './table-props'
import ColumnInput from './column-input'
import { EmptyStatus, Hint } from './icons-vue'
import { dateColumnWidthMap, handleColumnWidthMap, SizeCellConfigKey } from './config'
import { analyseData, getPropertyKeyByPath, calculateCurrentWidth } from './util'
import {
  collectFilterableColumns,
  modelToTableFilteredValues,
  mergeTableFilterModel,
  tableFilteredValuesToModel
} from './filter-util'
import { resolveRowKeyGetter, createRowMatcher, flattenTreeRows } from './selection-util'
import { useLocale } from '../hooks/use-locale'
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
  emits: ['sort', 'filter-change', 'update:filterModel', 'update:data', 'update:selectColumns', 'mainFieldClick', 'update:selectRadio', 'row-click'],
  setup (props: TTableProps, context) {
    const cipConfig = useCipConfig()
    const cipPageConfig = useCipPageConfig()
    const { t } = useLocale()
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
    const _filterIcon = computed(() => {
      return tableUsingConfig('filterIcon') as ((scope: { filterOpened: boolean }) => VNode) | undefined
    })
    // 仅依赖 columns，columns 不变时复用同一份 meta，避免转换时重复 traverse
    const filterableColumns = computed(() => collectFilterableColumns(props.columns))

    // 依赖 filterModel 的筛选字段 + filterableColumns；
    // 因 Vue 3 属性级响应式 + UpdateModelQueue 原地修改，非筛选字段变化不会触发重算
    const tableFilteredValues = computed(() => {
      if (props.filterModel === undefined) return undefined
      return modelToTableFilteredValues(props.filterModel, filterableColumns.value)
    })

    const calculateCurrentWidthFn: ComputedRef<(width: number, option?: ITransformWidthOption)=> number> = computed(() => {
      const customTransform = cipConfig.table?.transformPx
      if (typeof customTransform === 'function') {
        return (width, option) => customTransform(width, option) + addBorderWidth.value
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

    // 记录最近一次向父组件 emit 的 selectColumns 引用/对应的 data 引用：
    // 用户勾选触发的 emit 在标准 v-model 下会原样赋回 props.selectColumns（同一引用），
    // 借此识别出这种「回声」并跳过整表重扫，避免每次点击都触发一次 O(pageSize) 的同步
    const lastEmittedSelection = ref<unknown>(undefined)
    const lastSyncedData = ref<unknown>(undefined)
    const emitSelectColumns = (val: unknown) => {
      lastEmittedSelection.value = val
      context.emit('update:selectColumns', val)
    }

    // 移除部分选中项（配合 reserveSelection 使用），并同步 v-model:selectColumns
    const removeSelection = (rows: IAnyObject | IAnyObject[]) => {
      const table = cipTableRef.value
      if (!table) return
      const list: IAnyObject[] = Array.isArray(rows) ? rows : [rows]
      const rowKeyGetter = resolveRowKeyGetter(props.rowKey)
      const currentSelection = table.getSelectionRows() as IAnyObject[]
      list.forEach(target => {
        // 优先按引用匹配；引用不一致时（如调用方重新构造了对象）按 rowKey 兜底匹配
        const matched = currentSelection.includes(target)
          ? target
          : (rowKeyGetter && currentSelection.find(r => rowKeyGetter(r) === rowKeyGetter(target))) || target
        table.toggleRowSelection(matched, false)
      })
      emitSelectColumns(table.getSelectionRows())
    }

    // 程序化同步（prop -> UI）过程中置为 true，避免同步触发的原生 selection-change 反向覆盖父级 model
    const isSyncingSelection = ref(false)

    // 依据 v-model:selectColumns 对齐当前页（含树形子行）勾选状态
    // 仅在 selectType 为 checkbox 且 selectColumns 已被显式绑定（非 undefined）时生效，
    // 避免影响未使用该 v-model 的既有用法
    const syncSelectionFromModel = () => {
      if (props.selectType !== 'checkbox') return
      if (props.selectColumns === undefined) return
      // data 未变 且 selectColumns 恰好等于我们自己刚 emit 出去的引用 => 只是用户勾选的回声，
      // 当前页勾选状态已经是正确的，跳过整表重扫（否则每次点击都会触发一次 O(pageSize) 同步）
      const isOwnEcho = props.data === lastSyncedData.value && props.selectColumns === lastEmittedSelection.value
      lastSyncedData.value = props.data
      if (isOwnEcho) return
      const table = cipTableRef.value
      if (!table) return
      const model = (props.selectColumns || []) as IAnyObject[]
      isSyncingSelection.value = true
      if (model.length === 0) {
        // 显式赋空表示清空全部选中（含跨页保留的选中）
        table.clearSelection()
      } else {
        const rowKeyGetter = resolveRowKeyGetter(props.rowKey)
        const isMatched = createRowMatcher(model, rowKeyGetter)
        const currentlySelected = new Set<IAnyObject>(table.getSelectionRows())
        flattenTreeRows(props.data, props.treeProps).forEach(row => {
          const shouldSelect = isMatched(row)
          // 状态已一致时跳过，避免无意义的 toggleRowSelection 调用（内部仍会做一次线性查找）
          if (shouldSelect === currentlySelected.has(row)) return
          table.toggleRowSelection(row, shouldSelect)
        })
      }
      nextTick(() => { isSyncingSelection.value = false })
    }

    // selectColumns 或 data（分页/刷新）变化后都需要重新对齐当前页勾选
    // 在 onMounted 内注册（而非 setup 阶段）：此时 cipTableRef 已就绪，immediate 首次执行
    // 才能拿到表格实例完成回显；否则挂载前就同步赋值好的 selectColumns + 静态 data 会因
    // watch 不再重跑而丢失初始回显
    onMounted(() => {
      watch(
        () => [props.selectColumns, props.data] as const,
        syncSelectionFromModel,
        { immediate: true, flush: 'post' }
      )
    })

    context.expose({
      cipTableRef,
      removeSelection
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
    // 触发 table 筛选事件，并同步 v-model:filterModel
    const onFilterChange = (filters: Record<string, string[]>) => {
      if (props.filterModel !== undefined) {
        context.emit(
          'update:filterModel',
          mergeTableFilterModel(
            props.filterModel,
            tableFilteredValuesToModel(filters, filterableColumns.value),
            filterableColumns.value
          )
        )
      }
      context.emit('filter-change', filters)
    }
    // 触发列的选中改变事件（程序化同步 model -> UI 期间跳过，避免反向覆盖父级 model）
    const onSelectionChange = (val: unknown) => {
      if (isSyncingSelection.value) return
      emitSelectColumns(val)
    }
    // 如果带上了border则所有列宽需要+1
    const addBorderWidth = computed(() => {
      return _border.value ? 1 : 0
    })

    // 原始的width 转换系数
    const transformWidth = (widthStr: string | number, option?: ITransformWidthOption) => {
      const applyPx = calculateCurrentWidthFn.value
      if (typeof widthStr === 'number') return Math.ceil(applyPx(widthStr, option))
      if (widthStr.indexOf('px') > -1) return `${Math.ceil(applyPx(Number(widthStr.replace(/px$/, '')), option))}px`
      return widthStr
    }
    // 渲染table的单个数据列 注意此处为Column
    const renderTableColumn = ({ key, config }: { key: string, config: Partial<ITableColumnConfig['config']> } = { key: '', config: {} }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        children, type, formatter, columnType, textLevel, tableFormatter,
        filters, filter, filterPlacement, filterMultiple, filterMethod, filteredValue, columnKey: configColumnKey,
        ...tableColumnConfig
      } = config
      const resolvedColumnKey = configColumnKey ?? key
      const columnConfigRecord = config as Record<string, unknown>
      const columnFilterProps: Record<string, unknown> = {}
      if (filters !== undefined) columnFilterProps.filters = filters
      const resolvedFilterPlacement = filterPlacement ?? (typeof filter === 'string' ? filter : undefined)
      if (resolvedFilterPlacement !== undefined) columnFilterProps.filterPlacement = resolvedFilterPlacement
      const resolvedFilterMultiple = filterMultiple ?? columnConfigRecord['filter-multiple']
      if (resolvedFilterMultiple !== undefined) columnFilterProps.filterMultiple = resolvedFilterMultiple
      const resolvedFilterMethod = filterMethod ?? columnConfigRecord['filter-method']
      if (resolvedFilterMethod !== undefined) columnFilterProps.filterMethod = resolvedFilterMethod
      if (tableFilteredValues.value !== undefined) {
        if (filters !== undefined) {
          columnFilterProps.filteredValue = tableFilteredValues.value[key] ?? []
        }
      } else {
        const resolvedFilteredValue = filteredValue ?? columnConfigRecord['filtered-value']
        if (resolvedFilteredValue !== undefined) columnFilterProps.filteredValue = resolvedFilteredValue
      }
      // date 类型 强行修改宽度
      if (!tableColumnConfig.width) {
        // 兼容历史老代码
        if (config.type === 'date' && config.viewType === 'datetime') {
          tableColumnConfig.width = dateColumnWidthMap[_size.value]
        }
      } else {
        tableColumnConfig.width = transformWidth(tableColumnConfig.width)
      }
      if (tableColumnConfig.minWidth) {
        tableColumnConfig.minWidth = transformWidth(tableColumnConfig.minWidth)
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
        formatter: tableFormatter,
        columnKey: resolvedColumnKey,
        ...tableColumnConfig,
        ...columnFilterProps
      }, {
        header: headerSlots,
        'filter-icon': _filterIcon.value,
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
              columnKey: resolvedColumnKey,
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
          label: props.seqLabel || t('dr.table.index'),
          fixed: props.indexFixed ? 'left' : '',
          align: _defaultAlign.value,
          width: transformWidth(isEmpty(props.rowKey) ? 55 : 75, { columnType: 'index' })
        },
        {
          default: ({ $index }: ITableRow) => `${$index + 1 + props.offset!}`
        })
        slots.unshift(indexColumn)
      }
      // 复选框
      if (props.selectType === 'checkbox') {
        const option: {type: 'selection', width: string, fixed: string, selectable?: (row:IAnyObject, index:number)=> boolean, reserveSelection?: boolean} = {
          type: 'selection',
          width: transformWidth(45, { columnType: 'selection' }) as string,
          fixed: 'left'
        }
        if (isNotEmpty(props.selectable)) { // 选择
          option.selectable = (row, index) => props.selectable!(row || {}, index)
        }
        if (props.reserveSelection) { // 跨页保留选中，需配合rowKey使用
          if (!props.rowKey) {
            console.warn('[CipTable] reserveSelection 需要配合 rowKey 一起使用，否则跨页选中无法生效')
          } else {
            option.reserveSelection = true
          }
        }
        const selectionColumn = h(ElTableColumn, option)
        slots.unshift(selectionColumn)
      }
      // 单选框
      if (props.selectType === 'radio') {
        const selectionColumn = h(ElTableColumn, { width: transformWidth(45, { columnType: 'selection' }), fixed: 'left' }, {
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
        const expendColumn = h(ElTableColumn, { type: 'expand', width: transformWidth(32, { columnType: 'expand' }), fixed: 'left' }, {
          default: ({ row, index }: ITableRow & {index: number}) => context.slots.expand!({ row, index })
        })
        slots.unshift(expendColumn)
      }
      // jsx编译时有时候会去除_handler插槽
      // 注意_handler即将废弃请使用$handler代替
      if (props.withTableHandle && (context.slots._handler || context.slots.$handler)) {
        const handlerSlot = (context.slots._handler || context.slots.$handler) as Slot
        const handlerColumn = h(ElTableColumn, {
          label: t('dr.table.handler'),
          fixed: 'right',
          align: props.handlerAlign ?? _defaultAlign.value,
          headerAlign: props.handlerHeaderAlign,
          width: props.handlerWidth
            ? transformWidth(props.handlerWidth)
            : transformWidth(handleColumnWidthMap[_size.value] + addBorderWidth.value, { columnType: 'handler' })
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
        <div class="cip-table__empty__text">{t('dr.table.emptyText')}</div>
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
      onFilter-change={onFilterChange}
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
