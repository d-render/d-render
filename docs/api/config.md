# 字段配置

## 公共配置

### type

- 类型：`string`
- 说明：组件类型

```js
{
  name: {
    type: 'input',
    label: '姓名'
  }
}
```

### label

- 类型：`string`
- 说明：字段标签

### description

- 类型：`string`
- 说明：字段描述（显示为 tooltip）

### placeholder

- 类型：`string`
- 说明：占位文本

### width

- 类型：`number | string`
- 说明：字段宽度

### span

- 类型：`number`
- 说明：栅格占位

### defaultValue

- 类型：`any`
- 说明：默认值

### writable

- 类型：`boolean`
- 说明：是否可写

### readable

- 类型：`boolean`
- 说明：是否可读

### disabled

- 类型：`boolean`
- 说明：是否禁用

### hideItem

- 类型：`boolean`
- 说明：是否隐藏

### hideLabel

- 类型：`boolean`
- 说明：是否隐藏标签

### labelPosition

- 类型：`'left' | 'right' | 'top'`
- 说明：标签位置

### labelWidth

- 类型：`string | number`
- 说明：标签宽度

## 联动配置

### dependOn

- 类型：`Array<string | IRenderConfigDependOn>`
- 说明：依赖字段

详见[数据联动](/guide/dependon)。

### outDependOn

- 类型：`Array<string>`
- 说明：外部依赖字段

### otherKey

- 类型：`string | Array<string>`
- 说明：额外输出字段

详见[otherKey 详解](/guide/otherkey)。

### changeConfig

- 类型：`(config, values, outValues) => config`
- 说明：依赖变化时修改配置

### changeValue

- 类型：`(values, outValues) => { value, otherValue } | void`
- 说明：依赖变化时修改值

### resetValue

- 类型：`boolean`
- 说明：依赖变化时清空值

### changeValueByOld

- 类型：`({ key, oldValue }, values, outValues) => { value, otherValue } | void`
- 说明：基于旧值修改

### asyncOptions

- 类型：`TAsyncOptions | string`（`TAsyncOptions` 见 [API 参考](/api/#tasyncoptions)）
- 说明：异步获取选项列表。
  - **函数**：签名为 `(dependOnValues?, outDependOnValues?, extra?) => Promise<unknown[]>`，前两个参数与 `changeConfig` / `changeValue` 的依赖对象一致；`extra` 由具体组件传入（如远程搜索关键字）。
  - **字符串**：动态表单设计器等场景下保存的函数体源码，运行时会编译为与上述相同的入参顺序（`dependOnValues`、`outDependOnValues`）。

### immediateChangeValue

- 类型：`boolean`
- 说明：初始化时是否执行 changeValue

### changeEffect

- 类型：`(value, key, model) => Promise<boolean>`
- 说明：值变化前的拦截处理

## 表单配置

### required

- 类型：`boolean`
- 说明：是否必填

### requiredErrorMessage

- 类型：`string`
- 说明：必填错误提示

### regexpValidate

- 类型：`string`
- 说明：正则验证表达式

### regexpValidateErrorMessage

- 类型：`string`
- 说明：正则验证错误提示

### validateValue

- 类型：`'email' | 'identityCard' | 'mobilePhone'`
- 说明：内置验证类型

### validateValueErrorMessage

- 类型：`string`
- 说明：验证错误提示

### customValidators

- 类型：`Array<ICustomValidator>`
- 说明：自定义验证器

### directory

- 类型：`boolean`
- 说明：是否显示在表单目录

### no

- 类型：`string`
- 说明：序号

## 搜索表单配置

### immediateSearch

- 类型：`boolean`
- 说明：变更时立即搜索

### autoSelect

- 类型：`boolean`
- 说明：自动选择第一个选项

## 表格配置

### columnType

- 类型：`'checkbox' | 'mainField'`
- 说明：列类型

### dynamic

- 类型：`boolean`
- 说明：只读列是否响应 dependOn

### fixed

- 类型：`boolean | 'left' | 'right'`
- 说明：固定列

### minWidth

- 类型：`string`
- 说明：最小宽度

### align

- 类型：`'left' | 'center' | 'right'`
- 说明：对齐方式

### showOverflowTooltip

- 类型：`boolean`
- 说明：超出显示 tooltip

### formatter

- 类型：`Function`
- 说明：格式化函数

### selectable

- 类型：`(params: { row, index }) => boolean`
- 说明：复选框是否可选

## 高级配置

### sourceKey

- 类型：`string`
- 说明：从源配置继承

### realKey

- 类型：`string`
- 说明：实际输出的 key

### mergeDependOn

- 类型：`boolean`
- 说明：合并 dependOn 而非覆盖

### insert

- 类型：`{ before?: string, after?: string }`
- 说明：插入位置

### configSort

- 类型：`number`
- 说明：排序权重
