# API 参考

## 配置项

查看详细的配置项说明：

- [字段配置](/api/config) - 字段级别的配置项
- [方法](/api/methods) - 组件方法
- [事件](/api/events) - 组件事件

## 核心配置接口

### IRenderConfig

基础渲染配置，适用于表单、搜索表单、表格。

```ts
interface IRenderConfig {
  // 组件类型
  type?: string
  
  // 标签
  label?: string
  description?: string
  
  // 联动
  dependOn?: Array<string | IRenderConfigDependOn>
  outDependOn?: Array<string>
  
  // 额外输出
  otherKey?: string | Array<string>
  
  // 状态控制
  writable?: boolean
  readable?: boolean
  disabled?: boolean
  
  // 联动回调
  changeConfig?: TChangeConfig
  changeValue?: TChangeValue
  resetValue?: boolean
  changeValueByOld?: TChangeValueByOld
  
  // 异步选项
  asyncOptions?: (dependOnValue, outDependOnValues) => Promise<any[]>
  
  // 其他
  placeholder?: string
  defaultValue?: any
  width?: number | string
  span?: number
}
```

### TFormConfig

表单配置，继承自 IRenderConfig。

```ts
interface TFormConfig extends IRenderConfig {
  // 验证相关
  required?: boolean
  requiredErrorMessage?: string
  regexpValidate?: string
  regexpValidateErrorMessage?: string
  validateValue?: 'email' | 'identityCard' | 'mobilePhone'
  validateValueErrorMessage?: string
  
  // 自定义验证
  customValidators?: Array<ICustomValidator>
  customRequiredRule?: Function
  
  // 其他
  directory?: boolean  // 是否显示在表单目录
}
```

### TSearchFormConfig

搜索表单配置。

```ts
interface TSearchFormConfig extends IRenderConfig {
  immediateSearch?: boolean  // 变更时立即搜索
  autoSelect?: boolean       // 自动选择第一个选项
}
```

### TTableColumns

表格列配置。

```ts
interface TTableColumns extends IRenderConfig {
  columnType?: 'checkbox' | 'mainField'
  hideItem?: boolean
  dynamic?: boolean  // dependOn 是否生效
  fixed?: boolean | 'left' | 'right'
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  selectable?: (params: { row, index }) => boolean
}
```

## IRenderConfigDependOn

依赖配置。

```ts
interface IRenderConfigDependOn {
  key: string
  effect?: {
    changeValue?: boolean | Function
    changeConfig?: boolean | Function
    resetValue?: boolean
  } | boolean
}
```

## 辅助函数

### generateFieldList

将配置对象转换为字段列表。

```ts
function generateFieldList<Entity>(
  configMap: IFieldConfig<Entity>,
  ...source: Array<Record<keyof Entity, IEntityConfig> | IFieldConfig<Entity>>
): IFormConfig<Entity>[]
```

### defineFormFieldConfig

定义表单配置，提供类型提示。

```ts
function defineFormFieldConfig<Entity>(
  config: IFormFieldConfig<Entity>
): IFormFieldConfig<Entity>
```

### defineSearchFieldConfig

定义搜索表单配置。

```ts
function defineSearchFieldConfig<Entity>(
  config: ISearchFieldConfig<Entity>
): ISearchFieldConfig<Entity>
```

### defineTableFieldConfig

定义表格配置。

```ts
function defineTableFieldConfig<Entity>(
  config: ITableFieldConfig<Entity>
): ITableFieldConfig<Entity>
```

### keysToConfigMap

将键数组转换为配置映射。

```ts
function keysToConfigMap<Entity>(
  keys: Array<keyof Entity | (IRenderConfig & { key: keyof Entity })>
): IFieldConfig<Entity>
```

### insertFieldConfigToList

将字段配置插入到列表中。

```ts
function insertFieldConfigToList<Entity>(
  target: IFormConfig<Entity>[],
  source: IFormConfig<Entity>[]
): IFormConfig<Entity>[]
```
