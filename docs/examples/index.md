# 示例

这里提供了 d-render 的交互式示例，您可以直接操作体验。

## 表单基础

<FormBasicDemo />

## 表单联动

### 显示/隐藏联动 & 级联选择

<FormDependonDemo />

## 搜索表单

<SearchFormDemo />

## 可编辑表格

<TableDemo />

## 更多示例

### 自定义 type

查看[自定义 type](/guide/custom-type) 了解如何开发自定义组件。

### 表格联动

```vue
<template>
  <DrTable 
    v-model:data="tableData" 
    :columns="columns"
    :editType="'row'"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableData = ref([])

// 模拟接口
const fetchCategories = async () => {
  return [
    { value: 1, label: '电子产品' },
    { value: 2, label: '服装' }
  ]
}

const fetchProducts = async (categoryId) => {
  const productMap = {
    1: [
      { value: 101, label: '手机' },
      { value: 102, label: '电脑' }
    ],
    2: [
      { value: 201, label: 'T恤' },
      { value: 202, label: '裤子' }
    ]
  }
  return productMap[categoryId] || []
}

const columns = generateFieldList({
  category: {
    type: 'select',
    label: '分类',
    writable: true,
    asyncOptions: fetchCategories
  },
  product: {
    type: 'select',
    label: '产品',
    writable: true,
    dependOn: ['category'],
    resetValue: true,
    dynamic: true,  // 表格联动必须开启
    changeConfig: (config, { category }) => {
      config.disabled = !category
      return config
    },
    asyncOptions: async ({ category }) => {
      if (!category) return []
      return await fetchProducts(category)
    }
  },
  quantity: {
    type: 'number',
    label: '数量',
    writable: true
  }
})
</script>
```

::: warning 表格联动注意
表格只读列要响应 `dependOn`，必须开启 `dynamic: true`。
:::

### 验证示例

```vue
<template>
  <DrForm 
    ref="formRef"
    v-model:model="model" 
    :fieldList="fieldList"
  />
  <el-button @click="handleSubmit">提交</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const formRef = ref()
const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  username: {
    type: 'input',
    label: '用户名',
    required: true,
    requiredErrorMessage: '请输入用户名'
  },
  email: {
    type: 'input',
    label: '邮箱',
    validateValue: 'email',
    validateValueErrorMessage: '请输入正确的邮箱格式'
  },
  phone: {
    type: 'input',
    label: '手机号',
    validateValue: 'mobilePhone'
  },
  password: {
    type: 'input',
    label: '密码',
    regexpValidate: '^.{6,20}$',
    regexpValidateErrorMessage: '密码长度为 6-20 位'
  }
}))

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    console.log('提交数据:', model.value)
  } catch (e) {
    console.error('验证失败')
  }
}
</script>
```

### otherKey 示例

```vue
<script setup>
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const fieldList = generateFieldList(defineFormFieldConfig({
  userId: {
    type: 'select',
    label: '用户',
    otherKey: ['userName', 'userOption'],  // 同时存 id、name、option
    options: [
      { value: 1, label: '张三' },
      { value: 2, label: '李四' }
    ]
  }
}))
</script>
```

当选择"张三"时，数据模型为：
```json
{
  "userId": 1,
  "userName": "张三",
  "userOption": { "value": 1, "label": "张三" }
}
```
