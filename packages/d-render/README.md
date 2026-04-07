# d-render

> 基于 Element Plus 二次封装的数据驱动渲染组件库

[![npm version](https://img.shields.io/npm/v/d-render.svg?style=flat-square)](https://www.npmjs.com/package/d-render)
[![license](https://img.shields.io/npm/l/d-render.svg?style=flat-square)](https://github.com/d-render/d-render/blob/main/LICENSE)

## 📚 文档

**在线文档**: [https://d-render.github.io/d-render/](https://d-render.github.io/d-render/)

## ✨ 特性

- 🚀 **配置驱动** - 通过 JSON 配置即可渲染复杂表单
- 🔗 **数据联动** - 强大的 dependOn 机制
- 📦 **开箱即用** - 基于 Element Plus 二次封装
- 🎨 **自定义类型** - 轻松扩展自定义组件
- 📱 **多端适配** - 支持 PC 和移动端
- 🔧 **TypeScript** - 完整类型支持

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
  }
}))
</script>
```

## 🎨 插件

- `@d-render/plugin-standard` - 标准组件插件
- `@d-render/plugin-standard-configure` - 配置面板插件

## 📄 许可证

[MIT License](https://opensource.org/licenses/MIT)


