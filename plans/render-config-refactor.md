# IRenderConfig 类型整改方案

## 1. 问题总览

`IRenderConfig`、`ITableRenderConfig`、`IFormRenderConfig`、`ISearchRenderConfig` 四个类型存在以下问题：

| # | 问题 | 严重程度 |
|---|------|---------|
| 1 | `IFormConfig.config` 使用过于宽泛的 `IRenderConfig`，丢失 Form/SearchForm 专属属性类型 | 🔴 高 |
| 2 | `IRenderConfig` 与 `IBaseFormRenderConfig` 属性重复且类型不一致 | 🟡 中 |
| 3 | `IRenderConfig` 与 `IFormRenderConfig` 同名属性类型冲突 | 🔴 高 |
| 4 | `IFormConfig` 命名误导（Form + SearchForm 共用但名称暗示仅属于 Form） | 🟡 中 |
| 5 | SearchForm 通过 `IRenderConfig` 访问 `ISearchRenderConfig` 属性导致 TS 错误 | 🔴 高 |
| 6 | `CipFormItem` 仅支持 Form 类型，SearchForm 传入时类型不匹配 | 🟡 中 |
| 7 | 运行时内部属性（`_isGrid`、`_isShow`、`no`）混入公开类型接口 | 🟢 低 |
| 8 | `__render` 属性在 `IRenderConfig` 与 `ITableRenderConfig` 中签名冲突 | 🟡 中 |
| 9 | `ICustomValidator` 在 `config-util.ts` 和 `form-item-rules.ts` 中重复定义 | 🟢 低 |
| 10 | `hideItem` 位置不当（定义在 `ITableRenderConfig`，但 Form/Table/Layout 共用） | 🟡 中 |
| 11 | `border` 属性缺少类型定义（`cip-form-item` 使用但未在任何接口中定义） | 🟡 中 |
| 12 | `no` 的 `as string` 强制转换 Bug（`genNo` 可返回 `VNode`，但被强制转为 `string`） | 🔴 高 |

---

## 2. 详细问题分析

### 2.1 `IFormConfig.config` 类型过于宽泛

**当前定义：**
```typescript
// config-util.ts
export interface IFormConfig<T extends NoArrayObject<T> = Record<string, number>> {
  key: keyof T
  id?: string
  config: IRenderConfig  // ← 应该是 TFormConfig 或 TSearchFormConfig
  br?: boolean
}
```

**问题：** `IFormConfig` 被 `CipForm` 和 `CipSearchForm` 共用，但 `config` 字段只用了基础类型 `IRenderConfig`，导致：
- Form 特有属性（`required`、`customRequiredRule`、`directory`）无法类型检查
- SearchForm 特有属性（`immediateSearch`、`autoSelect`）无法类型检查

### 2.2 `IRenderConfig` 与 `IBaseFormRenderConfig` 属性重复

| 属性 | `IRenderConfig` | `IBaseFormRenderConfig` | 不一致 |
|------|-----------------|------------------------|--------|
| `span` | `span?: number` | `span?: number` | ✅ 一致 |
| `labelWidth` | `labelWidth?: string \| number` | `labelWidth?: string` | ❌ 不一致 |
| `labelStyle` | `labelStyle?: CSSProperties` | `labelStyle?: IAnyObject` | ❌ 不一致 |
| `itemStyle` | `itemStyle?: CSSProperties` | `itemStyle?: IAnyObject` | ❌ 不一致 |

### 2.3 `IRenderConfig` 与 `IFormRenderConfig` 同名属性冲突

| 属性 | `IRenderConfig` 类型 | `IFormRenderConfig` 类型 | 运行时实际使用 |
|------|---------------------|------------------------|--------------|
| `requiredType` | `FormItemRule['type']` ✅ | `'blur' \| 'change'` ❌ | `requiredRule.type = config.requiredType` → 应为 `FormItemRule['type']` |
| `validateValue` | `string` (过于宽泛) | `'email' \| 'identityCard' \| 'mobilePhone'` (缺少 `'sql'`) | `validatorMap[config.validateValue]` → 键含 `'sql'` |
| `validateExistRemote` | `(value, values, outValues) => ...` ✅ (3参数) | `(value, dependOnValues) => ...` ❌ (2参数) | 实际调用传3参数: `config.validateExistRemote!(value, dependOnValues, outDependOnValues)` |
| `validateExistRemoteErrorMessage` | `string` | `string` | ✅ 一致，但重复定义 |

### 2.4 `IFormConfig` 命名误导

`IFormConfig` 实际上是 Form 和 SearchForm 共用的字段容器类型，但名字暗示它只属于 Form。

### 2.5 SearchForm 类型错误示例

```typescript
// cip-search-form/index.tsx
const isImmediateSearch = (config: IRenderConfig) => {
  return config.immediateSearch === true || config.autoSelect === true
  //     ^^^^^^^^^^^^^^ TS错误: IRenderConfig上不存在这些属性
}
```

### 2.6 运行时内部属性

| 属性 | 注入位置 | 注入方式 |
|------|---------|---------|
| `_isGrid` | `cip-form/index.tsx` | `config._isGrid = grid.value` |
| `_isShow` | `cip-form/index.tsx` | `config._isShow = isShow` |
| `no` | `cip-form/index.tsx` | `v.config.no = props.genNo(v, count)` |

### 2.7 `__render` 签名冲突

`IRenderConfig` 定义 `__render?: Slot<IAnyObject>`，而 `ITableRenderConfig` 定义 `__render?: (props: ITableRenderProps) => VNode`。两者签名不同但同名，在交集类型中会产生冲突。需要将 `IRenderConfig` 中的 `__render` 移出，让各子接口各自定义。

### 2.8 `ICustomValidator` 重复定义

`ICustomValidator` 同时存在于：
- `packages/shared/src/utils/config-util.ts`（权威来源）
- `packages/d-render/src/cip-form-item/form-item-rules.ts`（本地副本）

两处定义相同，应在整改中删除 `form-item-rules.ts` 中的本地副本，统一从 `@d-render/shared` 导入。

### 2.9 `directory` 类型不一致

`IRenderConfig` 中 `directory?: number`，而 `IFormRenderConfig` 中 `directory?: boolean`。

**运行时验证结论：** `directory` 实际为 `number` 类型（表示目录层级 level）：
```typescript
// cip-form/index.tsx — directory 作为 number（level）使用
directoryConfig.value[key] = { label: ..., level: config.directory as number }

// cip-form-item/index.tsx — directory 仅做 truthy 判断
const labelId = formItemConfig.value.directory ? props.fieldKey : undefined
```

`IFormRenderConfig` 中 `directory?: boolean` 是**错误定义**，应修正为 `number`。

### 2.10 `hideItem` 位置不当

`hideItem` 当前定义在 `ITableRenderConfig` 中，但实际上被 Form 和 Table 共同使用：
```typescript
// cip-form-item/index.tsx — Form 场景使用
'cip-form-item--hidden': !childStatus.value || formItemConfig.value.hideItem

// cip-form-layout/index.tsx — Layout 场景使用
class: ['cip-form-layout', { 'cip-form-layout--hidden': props.config?.hideItem }]

// cip-table/index.tsx — Table 场景使用
columns.filter(column => !column.config.hideItem)
```

`hideItem` 应移至 `IRenderConfig`（基础共有属性）。

### 2.11 `border` 属性缺少类型定义

`border` 在 `cip-form-item/index.tsx` 中通过 `props.config?.border` 访问，但未在任何 config 接口中定义：
```typescript
// cip-form-item/index.tsx
'cip-form-item--border': props.config?.border !== false
```

这是一个无类型支持的运行时属性，应补充到 `IFormRenderConfig` 中。

### 2.12 `no` 的 `as string` 强制转换 Bug

`genNo` 的返回类型为 `VNode | string`，但 `cip-form-item` 中将 `no` 强制转换为 `string`：
```typescript
// cip-form-item/index.tsx
if (formItemConfig.value.no) {
  result.unshift(formItemConfig.value.no as string)  // ← Bug: 应支持 VNode
}
```

当 `genNo` 返回 `VNode` 时，此强制转换会导致运行时异常。应在整改中一并修复。

---

## 3. 整改方案

### 3.1 目标类型架构

```
IRenderConfig (基础 - 三者共有，去除form/table/search特有属性)
    ├── IBaseFormRenderConfig (form + searchForm 共有的布局属性)
    ├── IFormRenderConfig (form 特有，修正冲突属性)
    ├── ISearchRenderConfig (searchForm 特有)
    ├── ITableRenderConfig (table 特有)
    └── IRuntimeConfig (运行时内部注入属性)

组合类型:
    TFormConfig       = ExtendedConfig & IBaseFormRenderConfig & IFormRenderConfig & IRuntimeConfig
    TSearchFormConfig = ExtendedConfig & IBaseFormRenderConfig & ISearchRenderConfig & IRuntimeConfig
    TTableColumns     = ExtendedConfig & ITableRenderConfig & IRuntimeConfig

容器类型:
    IFieldItem<C = IRenderConfig> = { key: string, id?: string, config: C, br?: boolean }
    IFormFieldItem     = IFieldItem<TFormConfig>
    ISearchFieldItem   = IFieldItem<TSearchFormConfig>
    ITableColumnItem   = IFieldItem<TTableColumns> & { config: { children: ITableColumnItem[] } }

兼容别名 (deprecated):
    IFormConfig = IFieldItem  // 向后兼容
```

### 3.2 步骤1: 清理 `IRenderConfig`

#### 从 `IRenderConfig` 移至 `IFormRenderConfig` 的属性

| 属性 | `IRenderConfig` 当前类型 | `IFormRenderConfig` 修正后类型 | 备注 |
|------|------------------------|---------------------------|------|
| `requiredType` | `FormItemRule['type']` | `FormItemRule['type']` | 原IFormRenderConfig的`'blur'\|'change'`是错误的 |
| `validateValue` | `string` | `'email' \| 'identityCard' \| 'mobilePhone' \| 'sql'` | 补充遗漏的`'sql'` |
| `validateExistRemote` | 3参数版本 | 3参数版本（统一签名） | 原2参数版本不匹配运行时 |
| `validateExistRemoteErrorMessage` | `string` | `string` | 去重 |
| `regexpValidateErrorMessage` | `string` | `string` | 移至 IFormRenderConfig |
| `directory` | `number` | `number` | ✅ 已验证: 运行时为 `number`（表示层级 level），`IFormRenderConfig` 中 `boolean` 是错误定义 |
| `staticInfo` | `string` | `string` | Form 专属 |

#### 从 `IRenderConfig` 移至 `IBaseFormRenderConfig` 的属性

| 属性 | 统一后类型 | 备注 |
|------|----------|------|
| `span` | `number` | 去重 |
| `labelWidth` | `string \| number` | 统一类型 |
| `labelStyle` | `CSSProperties` | 统一类型（替代 IAnyObject） |
| `itemStyle` | `CSSProperties` | 统一类型 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | 从 IRenderConfig 移入 |
| `hideLabel` | `boolean` | 从 IRenderConfig 移入 |
| `contentEnd` | `boolean` | 从 IRenderConfig 移入 |
| `itemMarginBottom` | `string` | 从 IRenderConfig 移入 |

#### 从 `IRenderConfig` 移至 `IRuntimeConfig` 的属性

| 属性 | 类型 | 注入方式 |
|------|------|---------|
| `_isGrid` | `number` | `cip-form` 渲染时: `config._isGrid = grid.value` |
| `_isShow` | `boolean` | `cip-form` 渲染时: `config._isShow = isShow` |

#### 从 `IFormRenderConfig` 移至 `IRuntimeConfig` 的属性

| 属性 | 类型 | 注入方式 |
|------|------|---------|
| `no` | `string \| VNode` | `cip-form` 渲染时: `v.config.no = props.genNo(v, count)` |

✅ **已验证：** `genNo` 的 PropType 为 `(v: IFormConfig, count: number) => VNode | string`，确实可返回 `VNode`。当前 `cip-form-item/index.tsx` 中 `formItemConfig.value.no as string` 是 Bug，需修复为支持 `VNode | string`。

#### 从 `IRenderConfig` 移至 `ITableRenderConfig` 的属性

| 属性 | `IRenderConfig` 当前类型 | `ITableRenderConfig` 修正后类型 | 备注 |
|------|------------------------|------------------------------|------|
| `__render` | `Slot<IAnyObject>` | `(props: ITableRenderProps) => VNode` | 签名冲突，从 `IRenderConfig` 移出，Table 用自己的签名 |

> **说明：** `__render` 在 Form/SearchForm 场景下也使用 `Slot<IAnyObject>` 签名，因此应在 `IBaseFormRenderConfig` 中保留 `__render?: Slot<IAnyObject>`，Table 则在 `ITableRenderConfig` 中使用自己的签名覆盖。

```typescript
// 基础的渲染配置 form searchForm table 共有
export interface IRenderConfig <T extends keyof ComposeType = keyof ComposeType, V = unknown> {
  ruleKey?: string
  sourceKey?: string
  realKey?: string
  mergeDependOn?: boolean
  /** 组件类型 */
  type?: T
  /** 表单项label文案展示 */
  label?: string
  /** 辅助说明 */
  description?: string
  descriptionEffect?: 'light' | 'dark' | (string & { })
  /** 表单项宽度 */
  width?: number | string
  /** 依赖项 */
  dependOn?: Array<string | IRenderConfigDependOn<T>>
  outDependOn?: Array<string>
  /** 另一个key */
  otherKey?: string | Array<string>
  /** 是否可编辑 */
  writable?: boolean
  /** 是否可读 */
  readable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  configSort?: number
  importDisabled?: boolean
  /** 修改配置（受dependOn影响） */
  changeConfig?: TChangeConfig<T>
  changeConfigStr?: string
  /** 修改值（受dependOn影响） */
  changeValue?: TChangeValue
  changeValueStr?: string
  resetValue?: boolean
  immediateChangeValue?: boolean
  changeValueByOld?: TChangeValueByOld
  changeEffect?: (value: unknown, key: string, model: IAnyObject) => Promise<boolean>
  insert?: TInsert
  /** 占位 */
  placeholder?: string
  noMatchText?: string
  clearable?: boolean
  defaultValue?: V
  asyncOptions?: (dependOnValue: any, outDependOnValues: any) => Promise<any[]>
  /** 是否隐藏整个表单项 */
  hideItem?: boolean            // 从 ITableRenderConfig 移入（Form/Table/Layout 共用）
  // css
  inputStyle?: CSSProperties
  style?: CSSProperties
}
```

### 3.3 步骤2: 新增 `IRuntimeConfig`

```typescript
/** 运行时内部注入属性，不应由用户直接配置 */
export interface IRuntimeConfig {
  /** 内部属性: layout 的 item 需要用到 */
  _isGrid?: number
  /** 内部属性: 控制是否显示 */
  _isShow?: boolean
  /** 内部属性: 序号，由 genNo 注入 */
  no?: string | VNode
}
```

### 3.4 步骤3: 修正 `IBaseFormRenderConfig`

```typescript
/** form 及 searchForm 共有的布局属性 */
export interface IBaseFormRenderConfig {
  /** 当前表单项占用的栅格数 */
  span?: number
  labelWidth?: string | number  // 统一为 string | number
  labelStyle?: CSSProperties     // 统一为 CSSProperties
  itemStyle?: CSSProperties      // 统一为 CSSProperties
  labelPosition?: 'left' | 'right' | 'top'  // 从 IRenderConfig 移入
  hideLabel?: boolean            // 从 IRenderConfig 移入
  contentEnd?: boolean           // 从 IRenderConfig 移入
  itemMarginBottom?: string      // 从 IRenderConfig 移入
  /** 自定义渲染插槽，form/searchForm 场景使用 */
  __render?: Slot<IAnyObject>     // 从 IRenderConfig 移入（Table 在 ITableRenderConfig 中单独定义）
}
```

### 3.5 步骤4: 修正 `IFormRenderConfig`

```typescript
/** form 特有的属性 */
export interface IFormRenderConfig<TType extends keyof ComposeType = keyof ComposeType> {
  /** 当前表单项是否必填 */
  required?: boolean
  customRequiredRule?: (config: IRenderConfig<TType>, otherValue: IAnyObject, dependOnValues: IAnyObject, outDependOnValues: IAnyObject) => FormItemRule
  requiredErrorMessage?: string
  triggerType?: 'input' // 文字提示 请输入 ｜ 请选择
  // 修正: 原为 'blur'|'change'，实际运行时赋值给 FormItemRule.type
  requiredType?: FormItemRule['type']
  // 修正: 补充遗漏的 'sql'
  validateValue?: 'email' | 'identityCard' | 'mobilePhone' | 'sql'
  regexpValidate?: string
  // 从 IRenderConfig 移入
  regexpValidateErrorMessage?: string
  // 修正: 统一为3参数签名，匹配运行时调用
  validateExistRemote?: (value: unknown, dependOnValues: IAnyObject, outDependOnValues: IAnyObject) => Promise<{data: boolean}> | {data: boolean}
  // 从 IRenderConfig 移入（去重）
  validateExistRemoteErrorMessage?: string
  requiredRuleConfig?: any
  validateValueErrorMessage?: string
  customValidators?: Array<ICustomValidator>
  // Form 专属
  importantDisabled?: boolean
  // ✅ 已验证: directory 运行时为 number（层级），原 IFormRenderConfig 中 boolean 是错误定义
  directory?: number
  staticInfo?: string
  /** 表单项边框（showOnly + border 将出现边框） */
  border?: boolean               // 新增: cip-form-item 中使用但原未定义
}
```

> **`ICustomValidator` 去重：** 同时删除 `packages/d-render/src/cip-form-item/form-item-rules.ts` 中的本地 `ICustomValidator` 定义，统一从 `@d-render/shared` 导入。

> **Bug 修复：** `cip-form-item/index.tsx` 中 `formItemConfig.value.no as string` 需改为直接使用（支持 `VNode | string`）：
> ```typescript
> // 修复前
> result.unshift(formItemConfig.value.no as string)
> // 修复后
> result.unshift(formItemConfig.value.no!)
> ```

### 3.6 步骤5: 重命名 `IFormConfig` → `IFieldItem`

```typescript
/** 通用字段项容器 */
export interface IFieldItem<C = IRenderConfig> {
  key: string
  id?: string
  config: C
  /** 是否在此字段前强制换行 */
  br?: boolean
}

/** 便捷别名 */
export type IFormFieldItem = IFieldItem<TFormConfig>
export type ISearchFieldItem = IFieldItem<TSearchFormConfig>
export type ITableColumnItem = IFieldItem<TTableColumns> & { config: ITableColumnItem['config'] & { children: Array<ITableColumnItem> } }

/** 向后兼容别名 (deprecated) */
export type IFormConfig<T extends NoArrayObject<T> = Record<string, number>> = IFieldItem
```

### 3.7 步骤6: 更新组合类型

```typescript
export type TFormConfig = ExtendedConfig & IBaseFormRenderConfig & IFormRenderConfig & IRuntimeConfig
export type TSearchFormConfig = ExtendedConfig & IBaseFormRenderConfig & ISearchRenderConfig & IRuntimeConfig
export type TTableColumns = ExtendedConfig & ITableRenderConfig & IRuntimeConfig
```

### 3.8 步骤7: 更新受影响文件

| 文件 | 改动 |
|------|------|
| `packages/shared/src/utils/config-util.ts` | 核心类型重构（步骤1-6的所有改动） |
| `packages/shared/src/utils/index.ts` | 新增 `IFieldItem`、`IRuntimeConfig` 等导出 |
| `packages/d-render/src/cip-form/index.tsx` | `IFormConfig` → `IFormFieldItem`；`IRenderConfig` → `TFormConfig` |
| `packages/d-render/src/cip-form-item/index.tsx` | `config` prop 类型改为 `TFormConfig \| TSearchFormConfig` |
| `packages/d-render/src/cip-form-item/form-item-rules.ts` | 移除 `config as IRenderConfig` 强制转换；删除本地 `ICustomValidator` 定义，改为从 `@d-render/shared` 导入 |
| `packages/d-render/src/cip-form-item/form-validator.ts` | 类型更新 |
| `packages/d-render/src/cip-form-item/util.ts` | `IRenderConfig` 引用更新 |
| `packages/d-render/src/cip-form-item/effect-executor.ts` | `TFormConfig`/`IRenderConfig` 引用更新 |
| `packages/d-render/src/cip-form-item/hooks/use-field-depend.ts` | `TFormConfig`/`IRenderConfig` 引用更新 |
| `packages/d-render/src/cip-form-item/hooks/use-field-rules.ts` | `TFormConfig` 引用更新 |
| `packages/d-render/src/cip-form-item/hooks/use-field-change.ts` | `TFormConfig` 引用更新 |
| `packages/d-render/src/cip-form-item/hooks/use-model-change.ts` | Form 类型引用更新 |
| `packages/d-render/src/cip-search-form/index.tsx` | `IFormConfig` → `ISearchFieldItem`；修复 `isImmediateSearch` 类型 |
| `packages/d-render/src/cip-search-form/props.ts` | `IFormConfig` → `ISearchFieldItem` |
| `packages/d-render/src/cip-search-form/use-expand.ts` | `IFormConfig` → `ISearchFieldItem` |
| `packages/d-render/src/cip-form-layout/index.tsx` | `IRenderConfig` → 更精确的类型 |
| `packages/d-render/src/cip-form-render/index.tsx` | `IFormConfig` → `IFieldItem`/`IFormFieldItem` |
| `packages/d-render/src/cip-table/index.tsx` | 类型更新 |
| `packages/d-render/src/cip-table/table-props.ts` | Table 类型更新 |
| `packages/d-render/src/cip-table/util.ts` | Table 类型更新 |
| `packages/d-render/src/cip-table/column-input.tsx` | `ITableColumnConfig['config']` 类型更新 |
| `packages/shared/src/hooks/use-form-layout.ts` | 类型更新 |
| `packages/shared/src/hooks/use-form-input.ts` | `IRenderConfig`/`ExtendedConfig` 引用更新 |
| `packages/shared/src/helper/layout/layout-props.ts` | 类型更新 |
| `packages/shared/src/helper/input/form-input-props.ts` | `IRenderConfig` 引用更新 |
| `packages/shared/src/helper/input/input-configure-options.ts` | `IFormFieldConfig` 引用更新 |
| `packages/shared/src/helper/form-content-copy.ts` | `IFormConfig` → `IFieldItem` |

---

## 4. 风险评估

| 风险项 | 级别 | 应对措施 |
|--------|------|---------|
| 属性从 `IRenderConfig` 移至子接口后，直接使用 `IRenderConfig` 访问这些属性的代码需更新 | 中 | 通过全局搜索确认所有引用点 |
| `IFormConfig` 重命名为 `IFieldItem` | 低 | 保留 `IFormConfig` 作为 deprecated 别名 |
| `requiredType` 类型从 `'blur'\|'change'` 修正为 `FormItemRule['type']` | 低 | 运行时验证确认原定义是错误的 |
| `validateValue` 补充 `'sql'` 值 | 低 | 运行时 `validatorMap` 已包含 `sql` 键 |
| `validateExistRemote` 统一为3参数签名 | 低 | 运行时实际已传3参数 |
| `directory` 类型修正为 `number` | 低 | ✅ 已验证: 运行时确认 `directory` 为 `number`（层级），原 `boolean` 定义是错误的 |
| `__render` 从 `IRenderConfig` 移出后影响面大 | 中 | 移至 `IBaseFormRenderConfig`（form/searchForm 场景），Table 在 `ITableRenderConfig` 中单独定义 |
| `ExtendedConfig` 依赖 `IRenderConfig`，属性移出后组合类型需靠交集补回 | 低 | `TFormConfig = ExtendedConfig & IBaseFormRenderConfig & ...` 已通过交集补回，但需注意 `ExtendedConfig` 不再单独包含布局/校验属性 |
| 外部消费者（其他包/项目）直接引用 `IRenderConfig` 访问移出属性 | 中 | 若包被外部引用，需评估是否在过渡期保留 `IRenderConfig` 旧属性并标记 `@deprecated`，或随主版本一起 breaking change |
| `ICustomValidator` 去重后 `form-item-rules.ts` 的导入路径变更 | 低 | 统一从 `@d-render/shared` 导入，无功能影响 |

---

## 5. 实施顺序

1. ✅ 验证 `requiredType` 和 `validateValue` 运行时行为
2. ✅ 验证待确认项：`directory` 实际类型（确认 `number`）、`genNo` 返回值含 `VNode`（确认）、`__render` 在各场景下的实际签名（Form/SearchForm 用 `Slot<IAnyObject>`，Table 用 `(props: ITableRenderProps) => VNode`）
3. ⬜ 修改 `packages/shared/src/utils/config-util.ts` 核心类型
4. ⬜ 更新 `packages/shared/src/utils/index.ts` 导出
5. ⬜ 更新 `packages/d-render/src/cip-form/index.tsx`
6. ⬜ 更新 `packages/d-render/src/cip-form-item/` 相关文件（index.tsx, form-item-rules.ts, form-validator.ts, util.ts, effect-executor.ts, hooks/*）
7. ⬜ 更新 `packages/d-render/src/cip-search-form/` 相关文件
8. ⬜ 更新 `packages/d-render/src/cip-form-layout/index.tsx`
9. ⬜ 更新 `packages/d-render/src/cip-form-render/index.tsx`
10. ⬜ 更新 `packages/d-render/src/cip-table/` 相关文件（index.tsx, table-props.ts, util.ts, column-input.tsx）
11. ⬜ 更新 `packages/shared/src/` 下的辅助文件（hooks/use-form-layout.ts, hooks/use-form-input.ts, helper/*）
12. ⬜ 运行 `tsc --noEmit` 全量类型检查，确保零 TS 错误
13. ⬜ 构建验证
14. ⬜ 关键组件运行时回归验证（`requiredType`、`validateExistRemote` 签名变更、`directory` 类型变更）

## 6. 关键依赖说明

### `ExtendedConfig` 与新架构的关系

`ExtendedConfig` 定义为 `IRenderConfig<T, V> & ComposeType[T]`。当属性从 `IRenderConfig` 移出后，`ExtendedConfig` 不再包含布局属性（`span`、`labelWidth` 等）、校验属性（`requiredType`、`validateValue` 等）和运行时属性（`_isGrid` 等）。这些属性通过组合类型的交集补回：

```
TFormConfig = ExtendedConfig          // 基础 + 组件特有
           & IBaseFormRenderConfig    // 补回布局属性
           & IFormRenderConfig        // 补回校验属性
           & IRuntimeConfig           // 补回运行时属性
```

因此，**任何使用 `ExtendedConfig` 但不使用 `TFormConfig` 的代码**，在整改后将不再能访问移出的属性，需要改为使用对应的组合类型。