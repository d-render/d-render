# @d-render/shared

## 2.1.13

### Patch Changes

- ### Added
  - **ITableRenderConfig**（shared）：新增 `textLevel` 列文字层级配置，支持 `primary`（主信息）、`regular`（常规，默认）、`secondary`（次要信息），用于区分表格列主次文字颜色。
  - **CipTableConfig**（shared）：新增 `transformPx` 自定义 px 宽度转换函数，优先级高于 `size` / `sizeStandard` 的换算逻辑；接收列配置原始 px 数值，返回实际渲染宽度（不含 border 补偿，内部自动叠加）。
  - **DrTable**（d-render）：支持列配置 `textLevel`，按层级应用 `text-primary` / `text-regular` / `text-secondary` 样式；`columnType` 为 `mainField` 时仍默认使用主信息样式。

## 2.1.12

### Patch Changes

- fix(shared): 优化 ITableRenderConfig 的类型

## 2.1.11

### Patch Changes

- feat(api): enhance asyncOptions type to support function signature and string representation

## 2.1.10

### Patch Changes

- 修复一下小错误

## 2.1.9

### Patch Changes

- feat(use-form-input): enhance getOptions function to accept additional parameters for improved flexibility

  - Updated getOptions to include an extra parameter for additional options.

## 2.1.8

### Patch Changes

- refactor(config-util): update field configuration types to improve type safety and consistency across field configurations

## 2.1.7

### Patch Changes

- refactor(config-util): enhance TFieldConfigMapSource type to include marked field configurations for form, search, and table

## 2.1.6

### Patch Changes

- feat(shared): [useFormInput] defaultValue & otherDefaultValue 支持函数

## 2.1.5

### Patch Changes

- feat(shared): [useFormInput]otherKey 也支持设置默认值

## 2.1.4

### Patch Changes

- refactor: 完善 d-render 和 shared 的类型

## 2.1.3

### Patch Changes

- refactor(hooks): 优化表单输入钩子的类型定义和上下文处理

## 2.1.2

### Patch Changes

- 优化 config-util 类型推导

## 2.1.1

### Patch Changes

- feat(shared): configMapToList 函数支持将内部的 br 提取出来

## 2.1.0

### Minor Changes

- refactor(config-util): 重构配置类型体系，拆分 IRenderConfig 为子接口
  - 新增 IBaseFormRenderConfig：表单/SearchForm 共有属性（span、labelWidth、labelStyle、itemStyle 等）
  - 新增 IFormRenderConfig：Form 专属属性（验证规则、directory、border、staticInfo 等）
  - 新增 ISearchRenderConfig：SearchForm 专属属性
  - 新增 ITableRenderConfig：Table 专属属性
  - 新增 IRuntimeConfig：运行时注入属性（\_isGrid、\_isShow、no）
  - 引入泛型容器类型 IFieldItem\<C\> 替代 IFormConfig
  - 新增 IFormFieldItem、ISearchFieldItem、ITableColumnItem 类型别名
  - TFormConfig/TSearchFormConfig/TTableColumns 通过交叉类型组合对应子接口
- fix(config-util): requiredType 从 'blur'|'change' 修正为 FormItemRule['type']
- fix(config-util): validateValue 补充缺失的 'sql' 选项
- fix(config-util): validateExistRemote 统一为三参数签名
- fix(config-util): directory 从 boolean 修正为 number
- fix(config-util): hideItem 从 ITableRenderConfig 移至 IRenderConfig（通用属性）
- fix(config-util): no 属性从 IFormRenderConfig 移至 IRuntimeConfig
- refactor(form-content-copy): IFormConfig 替换为 IFieldItem，动态属性访问使用 IAnyObject 类型断言
- refactor(use-form-layout): IFormConfig 替换为 IFieldItem，动态属性访问使用 IAnyObject 类型断言

## 2.0.7

### Patch Changes

- feat: 完善 use-form-input 内关于的类型

## 2.0.6

### Patch Changes

- feat(d-render): [dr-table]新增行编辑模式

## 2.0.5

### Patch Changes

- perf: 优化对 d-render 配置的类型推断

## 2.0.4

### Patch Changes

- perf(config-util): 优化 IRenderConfig 的类型定义 允许使用 `DRenderTypeExtensions` 接口进行扩展

## 2.0.3

### Patch Changes

- fix(use-form-input): 修复`useOptions`的 autoSelect 功能

## 2.0.2

### Patch Changes

- chore(package.json): 优化依赖库的位置

## 2.0.1

### Patch Changes

- feat(design): 设计器 preHandle、handle 插槽新增 selectItem 属性下发
  fix(design): 修复 copyRow 判断是否 layout 时实际渲染为 item,设计渲染为 layout 的组件无法正确 copy 的问题
  fix(shared): 修复 copyRow 判断是否 layout 时实际渲染为 item,设计渲染为 layout 的组件无法正确 copy 的问题

## 2.0.0

### Major Changes

- feat: 升级 element-plus 的版本

## 1.3.1

### Patch Changes

- polish: 优化引入，导出需要导出的类型定义

## 1.3.0

### Minor Changes

- feat(hooks): 扩展 useOptions 的功能时 options 支持树形数据

## 1.2.5

### Patch Changes

- chore: 重新打包发布

## 1.2.4

### Patch Changes

- dd9594f: fix(d-render&shared): 补充历史版本中存在的 ts 类型
- 9cffcf3: refactor(d-render&shared): 使用 typescript 重写
- 4ff59dd: fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题
- 53fcd96: fix(shared): [form-input-prop]修复 otherValue 的类型
- 78b3acc: fix(config-util): 修复类型定义
- 2dbc067: @d-render/shared 修改 IPropScheme 类型

## 1.2.4-beta.6

### Patch Changes

- fix(config-util): 修复类型定义

## 1.2.4-beta.5

### Patch Changes

- fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题

## 1.2.4-beta.4

### Patch Changes

- @d-render/shared 修改 IPropScheme 类型

## 1.2.4-beta.3

### Patch Changes

- fix(d-render&shared): 补充历史版本中存在的 ts 类型

## 1.2.4-beta.2

### Patch Changes

- fix(shared): [form-input-prop]修复 otherValue 的类型

## 1.2.4-beta.1

### Patch Changes

- refactor(d-render&shared): 使用 typescript 重写

## 1.2.3

### Patch Changes

- refactor(shared): [form-content-copy]不在对 copy table 做特殊处理

## 1.2.2

### Patch Changes

- docs(shared): [types]完善 useFormInput 内属性的类型
- feat(shared): [use-form-input]useOptions 支持关闭自动获取 options

## 1.2.1

### Patch Changes

- fix(share): export useDeepComputed

## 1.2.0

### Minor Changes

- feat(@d-render/shared): 新增`use-deep-computed`hook

## 1.1.4

### Patch Changes

- fix(shared): 修复`insertConfig`方法的逻辑错误

## 1.1.3

### Patch Changes

- feat(d-render): `form-layout`支持受控的布局组件

## 1.1.2

### Patch Changes

- fix(d.ts): 修复`insertConfig`的类型
