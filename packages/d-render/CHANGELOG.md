# d-render

## 3.2.3

### Patch Changes

- ### Added
  - **DrTable**：新增 `indexAlign`（`'left' | 'center' | 'right'`），控制序号列对齐；未传时回退到 `defaultAlign`。

## 3.2.2

### Patch Changes

- ### Added

  - **CipTableConfig**（shared）：`transformPx` 增加可选第二参数 `option.columnType`，用于按列角色区分宽度换算；新增 `TTransformWidthColumnType`：`data`（业务数据列）/ `index`（序号列）/ `selection`（多选/单选列）/ `expand`（展开列）/ `handler`（操作列）。既有 `(px) => number` 签名仍兼容。
  - **DrTable**（d-render）：内置列与数据列调用 `transformPx` 时传入对应 `columnType`；datetime 默认宽度纳入 `transformWidth` 换算。

  ### Fixed

  - **DrTable**：修复操作列默认宽度在 `border` 开启时重复叠加 1px 的问题。

- Updated dependencies
  - @d-render/shared@2.1.19

## 3.2.1

### Patch Changes

- ### Fixed
  - **DrTable**：补齐 `v-model:selectColumns` 的双向绑定——`selectType` 为 `checkbox` 时，父组件修改选中行集合后当前页复选框会正确回显（对象引用优先匹配，其次按 `rowKey` 匹配，`rowKey` 同时支持 `string`/`function`）；显式赋值为 `null`/`[]` 会清空全部（含跨页保留的）选中；程序化回显内部不会再向父组件反向 emit，避免把已跨页累计的选中列表覆盖成仅当前页。未绑定该 v-model（值始终为 `undefined`）时行为保持不变。

## 3.2.0

### Minor Changes

- feat(d-render): 支持国际化

## 3.1.21

### Patch Changes

- ### Added

  - **DrTable**：新增 `reserveSelection` 属性（默认 `false`），`selectType` 为 `checkbox` 时开启后，切换分页（`data` 变化）不再丢失已选中的行，需配合 `rowKey` 一起使用；未设置 `rowKey` 时会在控制台告警且不生效。
  - **DrTable**：新增 `removeSelection(rows)` 暴露方法，用于在删除部分已选中数据后手动同步内部选中状态与 `update:selectColumns`，避免残留已删除行的选中引用。

## 3.1.20

### Patch Changes

- ### Added
  - **changeValueByOld**（d-render）：回调新增 `dependOldValues` 参数，提供 dependOn 全部依赖字段变化前的完整旧值快照（结构与 `values` 一致）。适用于依赖字段为多选（数组）时，对比新旧值判断是新增还是减少了选项，从而实现"新增不处理、减少则清空"等场景。
  - **TChangeValueByOld**（shared）：类型同步新增可选的 `dependOldValues?: IAnyObject` 字段。
- Updated dependencies
  - @d-render/shared@2.1.17

## 3.1.19

### Patch Changes

- ### Fixed
  - **DrTable**：修复列配置 `columnKey` 未透传至列渲染配置的问题，确保自定义 `columnKey` 时单元格绑定与 `v-model:filterModel` 同步均使用解析后的字段名。

## 3.1.18

### Patch Changes

- ### Changed

  - **DrTable**：`v-model:filterModel` 使用 `columnKey`（替代 `filterKey`）；`filter-change` 仍使用列 `key`（与 `ElTableColumn.prop` 一致）。曾使用 `filterKey` 的列配置需改为 `columnKey`。

- Updated dependencies
  - @d-render/shared@2.1.16

## 3.1.17

### Patch Changes

- ### Added
  - **DrTable**：支持通过 `DrConfigProvider` 或页面配置的 `table.filterIcon` 自定义列筛选图标，函数签名与 Element Plus TableColumn `filter-icon` 插槽一致（接收 `{ filterOpened }` 并返回 `VNode`）。

## 3.1.16

### Patch Changes

- ### Added
  - **DrTable**（d-render）：支持列筛选，透传 `filters`、`filterMultiple`、`filterMethod` 等配置至 Element Plus TableColumn，并触发 `filter-change` 事件；新增 `v-model:filterModel` 与搜索表单 model 双向同步，合并时仅更新筛选相关字段。
  - **filter-util**（d-render）：导出 `tableFilteredValuesToModel`、`modelToTableFilteredValues`、`mergeTableFilterModel`、`collectFilterableColumns` 筛选值转换工具。
  - **ITableRenderConfig**（shared）：新增 `filters`、`filterPlacement`、`filter`、`filterMultiple`、`filterMethod`、`filteredValue`、`filterKey` 列筛选相关类型定义；`filterKey` 默认与列 key 相同，用于与搜索表单字段同步。
- Updated dependencies
  - @d-render/shared@2.1.15

## 3.1.15

### Patch Changes

- ### Fixed
  - **DrSearchForm**：修复 `updateModel` 在值与 `defaultModel` 相同时删除对应字段的行为，改为直接透传 `model` 更新，避免与 `defaultModel` 合并逻辑冲突。

## 3.1.14

### Patch Changes

- ### Fixed
  - **DrSearchForm**：修复 `defaultModel` 合并条件判断错误，仅在 `model` 字段为空且 `defaultModel` 对应值非空时才写入默认值。

## 3.1.13

### Patch Changes

- ### Fixed
  - **DrSearchForm**：优化 `formModel` 与 `defaultModel` 的 watch 同步逻辑，改用本地 ref 并在 `pre`/`post` 刷新阶段分别同步 `model` 与默认值合并，提升响应式更新可靠性。

## 3.1.12

### Patch Changes

- ### Fixed
  - **DrSearchForm**：修复存在 `defaultModel` 时字段 `resetValue` 无法有效触发的问题；改为直接绑定 `model` 并在空值时合并 `defaultModel`，同时将 `model` 标记为必填 prop。

## 3.1.11

### Patch Changes

- ### Fixed
  - **d-render**：修复导出 `version` 后 TypeScript 声明文件（`types/`）生成异常的问题；版本号改为构建时通过 `__D_RENDER_VERSION__` 注入，不再从 `package.json` 直接导入。

## 3.1.10

### Patch Changes

- ### Fixed

  - **DrTable**：列配置 `minWidth` 与 `width` 一样经 `transformWidth` 处理，随表格 `size`、`border` 及 `transformPx` 缩放。
  - **DrTable**：修复列配置 `tableFormatter` 未正确传给 `ElTableColumn` 的问题。

  ### Changed

  - **DrTable**：`handlerWidth` prop 类型由 `string` 扩展为 `string | number`，与列宽转换逻辑一致。

## 3.1.9

### Patch Changes

- ### Added
  - **ITableRenderConfig**（shared）：新增 `textLevel` 列文字层级配置，支持 `primary`（主信息）、`regular`（常规，默认）、`secondary`（次要信息），用于区分表格列主次文字颜色。
  - **CipTableConfig**（shared）：新增 `transformPx` 自定义 px 宽度转换函数，优先级高于 `size` / `sizeStandard` 的换算逻辑；接收列配置原始 px 数值，返回实际渲染宽度（不含 border 补偿，内部自动叠加）。
  - **DrTable**（d-render）：支持列配置 `textLevel`，按层级应用 `text-primary` / `text-regular` / `text-secondary` 样式；`columnType` 为 `mainField` 时仍默认使用主信息样式。
- Updated dependencies
  - @d-render/shared@2.1.13

## 3.1.8

### Patch Changes

- feat(d-render): add handlerAlign and handlerHeaderAlign props for customizable column alignment

## 3.1.7

### Patch Changes

- feat(d-render): [DrTable]新增 defaultAlign 属性控制列内容的默认对其方式
  feat(d-render): [DrConfigProvider]新增全局配置控制组件

## 3.1.6

### Patch Changes

- feat(d-render): [cip-search-form]add changeCount tracking for model updates and improve button rendering

## 3.1.5

### Patch Changes

- feat(d-render): [DrSearchForm]支持操作区多列与 operation 插槽

  - 新增 props operationSpan，控制搜索操作区在 CSS Grid 中占据的列数（默认 1，兼容旧版）
  - 新增 operation 插槽， 插槽存在时替代默认按钮并下发函数
  - useExpand 中 haveExpand、rowMaxIndex 使用 threshold = gridCount - operationSpan + 1,
    与「操作区占用列数」对齐；operationSpan 为 1 时与原先基于 gridCount 的行为一致
  - 搜索按钮区域 gridColumn 按 operationSpan 设置起始列与 span；

## 3.1.4

### Patch Changes

- fix(d-render): [DrSearchForm]修复组件 changeValue 无效的问题
  - 临时解决方案，此问题是由于 defaultModel 的合并引入的，到不传入仅修复 defaultModel 存在的情况

## 3.1.2

### Patch Changes

- refactor: 完善 d-render 和 shared 的类型
- Updated dependencies
  - @d-render/shared@2.1.4

## 3.1.1

### Patch Changes

- fix(cip-form): 修复内联模式下表单字段配置换行（`br`）不生效的问题
- refactor(cip-form): 优化表单布局列间距样式

## 3.1.0

### Minor Changes

- refactor: 重构配置类型体系，拆分 IRenderConfig 为子接口
  - 将原先臃肿的 IRenderConfig 拆分为职责清晰的子接口体系（IBaseFormRenderConfig、IFormRenderConfig、ISearchRenderConfig、ITableRenderConfig、IRuntimeConfig）
  - 引入泛型容器类型 IFieldItem\<C\> 替代 IFormConfig，使字段项的 config 类型可精确约束
  - 废弃 IFormConfig 别名以保持向后兼容
- fix: 修复 formItemConfig.value.no 强制转 string 导致 VNode 丢失的问题
- fix: 修复 props.config?.border 类型不正确的问题，改用 formItemConfig.value.border
- fix: 修复 cip-form-layout config prop 类型为 IFieldItem 而非 TFormConfig 的问题
- fix: 消除 form-item-rules.ts 中重复的 ICustomValidator 定义

### Patch Changes

- Updated dependencies
  - @d-render/shared@2.1.0

## 3.0.8

### Patch Changes

- c2e26ae: feat:添加自定义表格序号属性字段

## 3.0.7

### Patch Changes

- feat(d-render): [dr-table]新增行编辑模式
- Updated dependencies
  - @d-render/shared@2.0.6

## 3.0.6

### Patch Changes

- fix(d-render): [cip-form]修复表单项 rules 变化后，不会清除严重的问题
- fix(d-render): [cip-form]修复 errorModel 为 default 模式下依然会出现 tooltip 的问题

## 3.0.5

### Patch Changes

- feat(d-render): [dr-form]新增`errorMode`用于控制表单验证项错误展示方式

## 3.0.4

### Patch Changes

- feat(d-render): [dr-form]允许 form 直接下发 changeCount

## 3.0.3

### Patch Changes

- chore(package.json): 优化依赖库的位置
- Updated dependencies
  - @d-render/shared@2.0.2

## 3.0.2

### Patch Changes

- fix(cip-table): 修复组件无法正常传出单选的问题

## 3.0.1

### Patch Changes

- 扩展 d-render，item 上添加相关类型的样式，扩展 design 内置的复制方法

## 3.0.0

### Major Changes

- feat: 升级 element-plus 的版本

### Patch Changes

- Updated dependencies
  - @d-render/shared@2.0.0

## 2.1.21

### Patch Changes

- polish: 优化引入，导出需要导出的类型定义
- Updated dependencies
  - @d-render/shared@1.3.1

## 2.1.20

### Patch Changes

- fix(form): 修复当表单设置为 labelWidth 且 labelPosition 为 top 时 form-item 的 labelWidth 依然被限制的问题
- fix(form-item): 修复 labelPosition 为 top 时 label 行右侧存在 12px 的内边距的问题

## 2.1.19

### Patch Changes

- fix(form-item): [use-model-change]修复清空数据要求为同一个 Symbol 导致部分情况下异常的问题，特别是 pnpm 安装时

## 2.1.18

### Patch Changes

- fix(table): 修复 thead 的中 icon 与文字的对齐问题

## 2.1.17

### Patch Changes

- fix(table): 修复表头中的提示图标
- fix(form-item): 修复 outDependOn 中的字段也判断是否和当前字段一样的问题

## 2.1.16

### Patch Changes

- fix(form-item): 修复 dependOn 收集逻辑错误导致 outDependOn 无法正常执行的问题

## 2.1.15

### Patch Changes

- dd9594f: fix(d-render&shared): 补充历史版本中存在的 ts 类型
- c4b9191: fix(cip-form): 支持 label-width
- 78b3acc: feat(cip-table): columns[number].config 中支持\_\_render 用于自定义渲染
- b383391: fix(cip-form): 修复`labelSuffix`属性不生效的问题
- 3a42787: polish(表单设计): 修改子表单样式
- 9cffcf3: refactor(d-render&shared): 使用 typescript 重写
- cb26e67: fix(cip-form-item): 修复 useModleChange 在更新多值时的 bug
- 1f0361c: fix(@d-render/design): 解决 tooltip 在手机端预览时偏移的问题
- bb37322: chore(d-render): 修改版本号后重新发布
- a820c6e: feat(cip-table): 扩展功能，新增 columnType: mainField 及 onMainFieldClick 事件
- 63ac231: fix(d-render): [cip-table]修复 fieldKey 的配置错误
- 17508f1: pref(cip-table): 优化 mainField 的时组件的使用方式
- 4ff59dd: fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题
- a30ad30: feat(cip-form-item): 新增 inParent、parentDependOnValues 属性
- 8ee6e2c: feat(cip-search-form): 支持搜索前数据验证
- 0d064aa: fix(d-render): [dependOn]修复副作用只能出发一次的问题
- Updated dependencies [dd9594f]
- Updated dependencies [9cffcf3]
- Updated dependencies [4ff59dd]
- Updated dependencies [53fcd96]
- Updated dependencies [78b3acc]
- Updated dependencies [2dbc067]
  - @d-render/shared@1.2.4

## 2.1.15-beta.16

### Patch Changes

- feat(cip-form-item): 新增 inParent、parentDependOnValues 属性

## 2.1.15-beta.15

### Patch Changes

- fix(@d-render/design): 解决 tooltip 在手机端预览时偏移的问题

## 2.1.15-beta.14

### Patch Changes

- feat(cip-table): columns[number].config 中支持\_\_render 用于自定义渲染
- Updated dependencies
  - @d-render/shared@1.2.4-beta.6

## 2.1.15-beta.13

### Patch Changes

- fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题
- Updated dependencies
  - @d-render/shared@1.2.4-beta.5

## 2.1.15-beta.12

### Patch Changes

- chore(d-render): 修改版本号后重新发布

## 2.1.15-beta.11

### Patch Changes

- fix(cip-form): 修复`labelSuffix`属性不生效的问题

## 2.1.15-beta.10

### Patch Changes

- polish(表单设计): 修改子表单样式

## 2.1.15-beta.9

### Patch Changes

- pref(cip-table): 优化 mainField 的时组件的使用方式

## 2.1.15-beta.8

### Patch Changes

- fix(cip-form-item): 修复 useModleChange 在更新多值时的 bug

## 2.1.15-beta.7

### Patch Changes

- feat(cip-table): 扩展功能，新增 columnType: mainField 及 onMainFieldClick 事件

## 2.1.15-beta.6

### Patch Changes

- fix(cip-form): 支持 label-width

## 2.1.15-beta.5

### Patch Changes

- feat(cip-search-form): 支持搜索前数据验证

## 2.1.15-beta.4

### Patch Changes

- fix(d-render): [dependOn]修复副作用只能出发一次的问题

## 2.1.15-beta.3

### Patch Changes

- fix(d-render&shared): 补充历史版本中存在的 ts 类型
- Updated dependencies
  - @d-render/shared@1.2.4-beta.3

## 2.1.15-beta.2

### Patch Changes

- fix(d-render): [cip-table]修复 fieldKey 的配置错误

## 2.1.15-beta.1

### Patch Changes

- refactor(d-render&shared): 使用 typescript 重写
- Updated dependencies
  - @d-render/shared@1.2.4-beta.1

## 2.1.14

### Patch Changes

- perf(cip-form-item): 优化 deepClone config 的逻辑

## 2.1.13

### Patch Changes

- fix(d-render): [cip-form-item]修复 span 的逻辑错误

## 2.1.12

### Patch Changes

- refactor(d-render): [cip-form-item]去除 grid 为 true 的转换逻辑,此部分由父组件直接转换

## 2.1.11

### Patch Changes

- fix(d-render): [cip-form]修复 grid 值小于字段配置中的 span 时导致的展示异常

## 2.1.10

### Patch Changes

- feat(d-render): [cip-form-item]允许通过 itemMarginBottom 的控制项的底部外边距

## 2.1.9

### Patch Changes

- fix(style): 修复 labelPosition 为 top 时 label 宽度过长导致意外的 label for 效果

## 2.1.8

### Patch Changes

- feat(styles): 扩展对 form-label 部分的背景色控制

## 2.1.7

### Patch Changes

- fix(styles): 修复 cip-button-text 存在 padding 导致宽度超过预期导致换行的问题

## 2.1.6

### Patch Changes

- fix(d-render): [cip-table]控制按钮的间距为 8px

## 2.1.5

### Patch Changes

- fix(d-render): [cip-search-form]修复直接使用 collapse 导致的问题

## 2.1.4

### Patch Changes

- fix(d-render): [cip-search-form]修复 collapse 的判断不争气的问题

## 2.1.3

### Patch Changes

- chore(cip-table): 修复一个小错误

## 2.1.2

### Patch Changes

- refactor(d-render): [cip-table]: 调整 config 的值为数字,调整 transformWidth

## 2.1.1

### Patch Changes

- feat(cip-table): 当 border 为 true 是 columns 的 width 会比默认的多 1

## 2.1.0

### Minor Changes

- feat(\*): 接入 xdpConfig 配置,可多更多的默认值进行修改

## 2.0.7

### Patch Changes

- feat(cip-table): 增加对 dangerButton 的控制,默认为不实用 danger 按钮

## 2.0.6

### Patch Changes

- fix(d-render): [cip-search-form]修复配置的--cip-form-label-color 不生效的问题

## 2.0.5

### Patch Changes

- feat(d-render): [cip-table] 支持通过`showDisabledButton`控制 table 中 disabled 的按钮是否展示。 需要@xdp/button >= 1.0.6

## 2.0.4

### Patch Changes

- feat(d-render): [cip-form-item]`tooltip`支持 cipConfig 配置 effect

## 2.0.2

### Patch Changes

- fix(d-render): 修复`form-layout`中的 modelValue 拼写错误的问题

## 2.0.1

### Patch Changes

- fix(d-render): 修改默认容器类型判断，使其为 pc 端

## 2.0.0

### Patch Changes

- feat(d-render): `form-layout`支持受控的布局组件
- Updated dependencies
  - @d-render/shared@1.1.3

## 1.1.15 (2023-05-23)

- chore(d-render): 杂项调整，无功能变化

## 1.1.14 (2023-05-23)

- pref(d-render): 替换所有使用`.el-icon-xx`的图标,采用`@element-plus/icons-vue`中导出的图标

## 1.1.13 (2023-05-22)

- fix(d-render): 修复`CipSearchForm`在传入 defaultModel 后，如果修改 model 的值，defaultModel 的信息将会写入到 model 中
  - ps: 此处其实不算 bug,但是为了少改项目已有左右结构的页面代码给予支持

## 1.1.12 (2023-05-22)

- fix(packages): 修复升级 11 版本后无法通过 `import 'd-redner/style'`的方式引入 d-render 的样式
  - 此为兼容性修复，11 版本可以通过 `import 'd-render/dist/index.css'`的方式 i 引入

## 1.1.11 (2023-05-19)

- fix(components): [cip-form-item]修复了 changeValue 在特殊情况下不能如设计的运行方式运行
  - 此 bug 出现在 CipForm 渲染后第一次修改 model 对象后 changeValue 不能如设计的不执行
  - 此 bug 修复后主要影响独立的修改页中需要立即执行的 changeValue 的属性,此中情况应明确添加属性`immediateChangeValue`

## 1.1.10 (2023-05-07)

- update(components) [cip-form-item]内部写入值时使用的 setFieldValue 方法的行为变更
  - 如在遇到 key 中带数字如 dept.0.name 时如 dept 不存在时
    - 修改前 `{dept: { 0: { name: 'value' } } }`
    - 修改后 `{dept: [ { name: 'value' } ] }`
