# 自定义组件示例

本示例展示如何开发和使用自定义 type 组件。

## 步骤概览

1. 创建 Vue 组件
2. 创建组件配置
3. 注册到 d-render
4. 使用自定义组件

## 步骤 1：创建组件

```vue
<template>
  <el-input
    v-model="proxyValue"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
  >
    <template #append>
      <el-button @click="handleSearch">搜索</el-button>
    </template>
  </el-input>
</template>

<script setup>
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, securityConfig } = useFormInput(props, emit)

const handleSearch = () => {
  console.log('搜索:', proxyValue.value)
}
</script>
```

## 步骤 2：创建配置

```js
// src/components/custom-input/component-config.js
export default {
  searchInput: {
    component: (mode) => () => import(`./search-input${mode}`)
  }
}
```

## 步骤 3：注册组件

```js
// d-render.config.js
import customInputsPlugin from '@/components/custom-input/component-config'

export default {
  plugins: [
    customInputsPlugin
  ]
}
```

## 步骤 4：使用组件

```vue
<script setup>
import { generateFieldList } from 'd-render'

const fieldList = generateFieldList({
  keyword: {
    type: 'searchInput',  // 使用自定义类型
    label: '关键词',
    placeholder: '请输入搜索关键词'
  }
})
</script>
```

## 完整示例

查看 [自定义 type](/guide/custom-type) 了解详细开发指南。

## 小结

- ✅ 使用 `useFormInput` hook 开发组件
- ✅ 通过 component-config 注册
- ✅ 支持 view/mobile/configure 模式
- ✅ 支持联动和 otherKey
