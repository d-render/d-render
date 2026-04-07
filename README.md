# d-render

> 基于 Element Plus 二次封装的数据驱动渲染组件库

[![npm version](https://img.shields.io/npm/v/d-render.svg?style=flat-square)](https://www.npmjs.com/package/d-render)
[![license](https://img.shields.io/npm/l/d-render.svg?style=flat-square)](https://github.com/d-render/d-render/blob/main/LICENSE)

## 📚 文档

- **在线文档**: [https://d-render.github.io/d-render/](https://d-render.github.io/d-render/)
- **旧版文档**: [https://docs.d-render.x-develop.cn](https://docs.d-render.x-develop.cn)

## ✨ 特性

- 🚀 **配置驱动** - 通过 JSON 配置即可渲染复杂表单，无需手写大量模板代码
- 🔗 **数据联动** - 强大的 `dependOn` 机制，轻松实现字段间的联动、级联、派生
- 📦 **开箱即用** - 基于 Element Plus 二次封装，提供丰富的表单、表格、搜索组件
- 🎨 **自定义类型** - 轻松扩展自定义输入组件，满足各种业务场景
- 📱 **多端适配** - 支持 PC 和移动端，一套配置多端运行
- 🔧 **TypeScript** - 完整的 TypeScript 支持，提供良好的类型提示

## 📦 核心组件

### CipForm / DrForm

针对数据 **新增/编辑/展示** 功能的表单渲染组件，内置联动逻辑，支持所有插件输入型/展示型/布局型类型。

### CipSearchForm / DrSearchForm

搜索表单组件，针对搜索数据有特殊处理，支持即时搜索、自动折叠等功能。

### CipTable / DrTable

支持树表格、行编辑、全表编辑的表格渲染组件，内置联动逻辑。

### CipFormRender / DrFormRender

将 `@d-render/design` 设计器生成的 JSON 渲染为表单。

### CipFormLayout / DrFormLayout

内置的布局型组件，支持卡片、栅格、标签页等布局方式。

## 📥 安装

```bash
# npm
npm install d-render element-plus -S

# yarn
yarn add d-render element-plus -S

# pnpm
pnpm add d-render element-plus -S
```

## 🚀 快速开始

### 1. 注册组件

```js
import { createApp } from 'vue'
import { DRender } from 'd-render'
import 'd-render/dist/index.css'
import 'element-plus/dist/index.css'
import dRenderConfig from './d-render.config'

const dRender = new DRender()
dRender.setConfig(dRenderConfig)

createApp(App).mount('#app')
```

### 2. 配置插件 (d-render.config.js)

```js
import PluginStandard from '@d-render/plugin-standard'

export default {
  plugins: [
    PluginStandard
  ]
}
```

### 3. 使用组件

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  name: {
    type: 'input',
    label: '姓名',
    required: true
  },
  age: {
    type: 'number',
    label: '年龄'
  },
  sex: {
    type: 'radio',
    label: '性别',
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
}))
</script>
```

## 🔗 数据联动

### 级联选择

```js
{
  province: {
    type: 'select',
    label: '省份',
    asyncOptions: fetchProvinces
  },
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCities(province)
    }
  }
}
```

### 动态显隐

```js
{
  type: {
    type: 'radio',
    label: '类型',
    options: [
      { value: 'personal', label: '个人' },
      { value: 'company', label: '企业' }
    ]
  },
  companyName: {
    type: 'input',
    label: '企业名称',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'
      return config
    }
  }
}
```

## 🎨 插件

### 官方插件

- `@d-render/plugin-standard` - 基于 Element Plus 实现的标准组件插件
- `@d-render/plugin-standard-configure` - 标准组件的配置面板

### 私有插件

- `@ltdp/d-render-plugin-cci` - 企业内部组件插件
- `@ltdp/d-render-plugin-cci-configure` - 企业内部组件配置面板

## 📖 更多文档

- [快速开始](https://d-render.github.io/d-render/guide/getting-started)
- [核心概念](https://d-render.github.io/d-render/guide/core-concepts)
- [数据联动](https://d-render.github.io/d-render/guide/dependon)
- [otherKey 详解](https://d-render.github.io/d-render/guide/otherkey)
- [自定义 type](https://d-render.github.io/d-render/guide/custom-type)
- [API 参考](https://d-render.github.io/d-render/api/)

## 📄 许可证

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present xmf
