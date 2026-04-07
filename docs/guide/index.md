# d-render 开发指南

## 什么是 d-render

`d-render` 本质上是一个**基于配置驱动渲染表单 / 搜索表单 / 表格**的组件库。

对外核心组件包括：

- `CipForm / DrForm` - 表单组件
- `CipFormItem / DrFormItem` - 表单项组件
- `CipFormLayout / DrFormLayout` - 表单布局组件
- `CipSearchForm / DrSearchForm` - 搜索表单组件
- `CipTable / DrTable` - 表格组件
- `CipFormRender / DrFormRender` - 表单渲染组件
- `CipTableRender / DrTableRender` - 表格渲染组件

同时还暴露了一组配置辅助方法：

- `DRender` - 核心渲染类
- `generateFieldList` - 生成字段列表
- `insertFieldConfigToList` - 插入字段配置
- `keysToConfigMap` - 键转配置映射
- `defineSearchFieldConfig` - 定义搜索表单配置
- `defineFormFieldConfig` - 定义表单配置
- `defineTableFieldConfig` - 定义表格配置

## 特性

- 🚀 **配置驱动** - 通过 JSON 配置即可渲染复杂表单
- 🔗 **数据联动** - 强大的 dependOn 机制实现字段间联动
- 📦 **开箱即用** - 基于 Element Plus 二次封装
- 🎨 **自定义类型** - 轻松扩展自定义输入组件
- 📱 **多端适配** - 支持 PC 和移动端

## 核心理念

### 1. 你不是在写组件树，你是在写字段配置

核心产物是 `fieldList`。

### 2. type 决定渲染哪个组件

前提是这个 type 已注册到 `DRender`。

### 3. dependOn 决定"谁变化时我要重新算"

它是联动入口。

### 4. changeConfig / changeValue / resetValue 决定"重新算什么"

- `changeConfig`：改配置
- `changeValue`：改值
- `resetValue`：清值

### 5. otherKey 决定"额外产出的值存到哪里"

特别适合 select / cascader / dateRange / 自定义复合组件。

### 6. 自定义 type 的关键不是 UI，而是遵守 d-render 输入协议

推荐直接基于 `useFormInput` 开发。
