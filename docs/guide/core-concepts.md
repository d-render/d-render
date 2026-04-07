# 核心概念

## fieldList：字段配置列表

`fieldList` 是 d-render 的核心配置，它决定了表单 / 搜索表单 / 表格如何渲染。

### 配置结构

每个字段配置包含两个核心属性：

- `key`：字段名，对应 `model` 中的属性
- `config`：字段配置对象

```js
const fieldList = [
  { 
    key: 'name', 
    config: {
      type: 'input',
      label: '姓名',
      required: true
    }
  },
  { 
    key: 'age', 
    config: {
      type: 'number',
      label: '年龄'
    }
  }
]
```

### 使用 generateFieldList 简化配置

```js
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const fieldList = generateFieldList(defineFormFieldConfig({
  name: {
    type: 'input',
    label: '姓名'
  },
  age: {
    type: 'number',
    label: '年龄'
  }
}))
```

## type：组件类型

`type` 决定渲染哪个组件，前提是这个 type 已注册到 `DRender`。

### 内置类型

标准插件提供的常用类型：

- `input` - 输入框
- `number` - 数字输入框
- `select` - 下拉选择
- `radio` - 单选框
- `checkbox` - 复选框
- `date` - 日期选择
- `dateRange` - 日期范围
- `time` - 时间选择
- `switch` - 开关
- `textarea` - 文本域
- `cascader` - 级联选择
- `tree-select` - 树选择

### 布局类型

布局类型用于组织表单结构：

- `grid` - 栅格布局
- `card` - 卡片布局
- `tabs` - 标签页
- `collapse` - 折叠面板

### 自定义类型

你可以注册自己的组件类型，详见[自定义 type](/guide/custom-type)。

## key：字段名

字段最终写入 `model` 的 key。

```js
{
  name: {
    type: 'input',
    label: '姓名'
  }
}
```

表示这个输入框读写的是 `model.name`。

### 嵌套对象

支持嵌套对象路径：

```js
{
  'user.name': {
    type: 'input',
    label: '用户名'
  }
}
```

对应 `model.user.name`。

## label / description

- `label`：字段名
- `description`：label 右侧说明提示（支持 Tooltip）

```js
{
  username: {
    type: 'input',
    label: '用户名',
    description: '用于登录系统的唯一标识'
  }
}
```

## writable / readable

控制字段显示状态，有三种状态：

- `read-write`：可编辑
- `read`：只读
- `hidden`：隐藏

### 规则

- `readonly` 表单下默认只读
- `writable = true` 强制可写
- `readable = true` 只读可见
- 两者都不是时可能隐藏

### 示例

```js
// 始终可编辑
{
  name: {
    type: 'input',
    label: '姓名',
    writable: true
  }
}

// 只读显示
{
  createTime: {
    type: 'date',
    label: '创建时间',
    readable: true
  }
}

// 隐藏
{
  id: {
    type: 'input',
    label: 'ID',
    readable: false,
    writable: false
  }
}
```

## disabled

控制字段是否禁用。

```js
{
  name: {
    type: 'input',
    label: '姓名',
    disabled: true
  }
}
```

## 配置合并与继承

### sourceKey

从源配置继承字段配置。

### realKey

最终输出时使用别名 key。

### mergeDependOn

控制继承配置时 dependOn 是覆盖还是合并。

```js
{
  provinceId: {
    type: 'select',
    label: '省份',
    sourceKey: 'baseSelect',
    mergeDependOn: true
  }
}
```

## 三类配置的关系

### 公共配置

适用于表单、搜索表单、表格：

- `type`、`label`、`description`
- `dependOn`、`outDependOn`、`otherKey`
- `writable`、`readable`、`disabled`
- `changeConfig`、`changeValue`、`resetValue`
- `asyncOptions`、`placeholder`、`defaultValue`

### 表单专属配置

- `required` - 是否必填
- `customRequiredRule` - 自定义必填规则
- `regexpValidate` - 正则验证
- `customValidators` - 自定义验证器
- `directory` - 是否显示在表单目录

### 搜索表单专属配置

- `immediateSearch` - 变更时立即触发搜索
- `autoSelect` - options 组件自动选择第一个

### 表格专属配置

- `columnType` - 列类型（checkbox / mainField）
- `hideItem` - 是否隐藏
- `dynamic` - dependOn 是否生效（只读列需要开启）
- `formatter` - 格式化函数
- `fixed` - 固定列
- `align` - 对齐方式
- `selectable` - 复选框是否可选
