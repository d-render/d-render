# 快速开始

## 安装

```bash
# 使用 yarn
yarn add d-render element-plus -S

# 使用 npm
npm install d-render element-plus -S

# 使用 pnpm
pnpm add d-render element-plus -S
```

## 注册组件类型

`d-render` 不自带完整业务输入组件，需要你在项目启动时注册插件或自定义组件。

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

## d-render.config.js 配置文件

创建 `d-render.config.js` 文件：

```js
import PluginStandard from '@d-render/plugin-standard'

export default {
  plugins: [
    PluginStandard,
    // 其他自定义插件...
  ]
}
```

## 基本使用

### 表单

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

### 搜索表单

```vue
<template>
  <DrSearchForm 
    v-model:model="searchModel" 
    :fieldList="searchFieldList"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineSearchFieldConfig } from 'd-render'

const searchModel = ref({})

const searchFieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    immediateSearch: true
  },
  status: {
    type: 'select',
    label: '状态',
    options: [
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ]
  }
}))

const handleSearch = (val) => {
  console.log('搜索条件:', val)
}
</script>
```

### 表格

```vue
<template>
  <DrTable 
    v-model:data="tableData" 
    :columns="columns"
    :editType="editType"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableData = ref([
  { name: '张三', age: 25, sex: 1 },
  { name: '李四', age: 30, sex: 2 }
])

const editType = ref('row')

const columns = generateFieldList({
  name: { type: 'input', label: '姓名', writable: true },
  age: { type: 'number', label: '年龄', writable: true },
  sex: { 
    type: 'radio', 
    label: '性别', 
    writable: true,
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
})
</script>
```

## 下一步

- [核心概念](/guide/core-concepts) - 理解 d-render 的设计理念
- [数据联动](/guide/dependon) - 掌握 dependOn 的使用
- [otherKey 详解](/guide/otherkey) - 了解如何处理额外输出值
- [自定义 type](/guide/custom-type) - 开发自定义输入组件
