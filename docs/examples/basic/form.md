# 表单基础示例

本示例展示如何使用 d-render 创建一个基础表单。

## 效果演示

<FormBasicDemo />

## 核心配置

### 步骤 1：定义字段配置

使用 `generateFieldList` 和 `defineFormFieldConfig` 创建字段配置：

```js
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const fieldList = generateFieldList(defineFormFieldConfig({
  name: {
    type: 'input',      // 输入框类型
    label: '姓名',       // 字段标签
    required: true      // 是否必填
  },
  age: {
    type: 'number',     // 数字输入框
    label: '年龄'
  },
  sex: {
    type: 'radio',      // 单选框
    label: '性别',
    options: [          // 选项列表
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
}))
```

### 步骤 2：在模板中使用

```vue
<template>
  <DrForm 
    v-model:model="model" 
    :fieldList="fieldList"
    :grid="3"              // 3列布局
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  // ... 字段配置
}))

const handleSubmit = () => {
  console.log('提交数据:', model.value)
}
</script>
```

## 常用配置项

### 基础配置

| 配置项 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `type` | string | 组件类型 | `'input'`, `'select'`, `'radio'` |
| `label` | string | 字段标签 | `'姓名'` |
| `placeholder` | string | 占位文本 | `'请输入姓名'` |
| `defaultValue` | any | 默认值 | `''`, `0`, `[]` |

### 验证配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `required` | boolean | 是否必填 |
| `requiredErrorMessage` | string | 必填错误提示 |
| `validateValue` | string | 内置验证类型 |
| `regexpValidate` | string | 正则验证 |

### 显示配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `disabled` | boolean | 是否禁用 |
| `hideItem` | boolean | 是否隐藏 |
| `span` | number | 占用列数 |

## 完整示例代码

```vue
<template>
  <div>
    <DrForm
      ref="formRef"
      v-model:model="model"
      :fieldList="fieldList"
      :grid="2"
      label-width="100px"
    >
      <!-- 使用插槽自定义字段 -->
      <template #avatarInput="{ modelValue, updateModelValue }">
        <el-upload
          :model-value="modelValue"
          @update:model-value="updateModelValue"
        />
      </template>
    </DrForm>
    
    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const formRef = ref()
const model = ref({
  name: '',
  age: null,
  sex: null,
  email: '',
  phone: '',
  avatar: ''
})

const fieldList = generateFieldList(defineFormFieldConfig({
  avatar: {
    type: 'input',
    label: '头像'
  },
  name: {
    type: 'input',
    label: '姓名',
    required: true,
    placeholder: '请输入姓名',
    span: 2
  },
  age: {
    type: 'number',
    label: '年龄',
    min: 0,
    max: 150
  },
  sex: {
    type: 'radio',
    label: '性别',
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
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
  }
}))

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    console.log('提交成功:', model.value)
    // 提交到后端
  } catch (e) {
    console.error('验证失败')
  }
}

const handleReset = () => {
  formRef.value.clearValidate()
  model.value = {
    name: '',
    age: null,
    sex: null,
    email: '',
    phone: '',
    avatar: ''
  }
}
</script>
```

## 小结

- ✅ 使用 `generateFieldList` 创建字段列表
- ✅ 使用 `defineFormFieldConfig` 获得类型提示
- ✅ 通过 `type` 指定组件类型
- ✅ 通过 `options` 配置选项
- ✅ 通过 `required` 设置必填
- ✅ 通过 `span` 控制列宽
- ✅ 使用插槽自定义渲染

## 下一步

- [搜索表单示例](/examples/basic/search) - 学习搜索表单
- [表格基础示例](/examples/basic/table) - 学习表格使用
- [显示隐藏示例](/examples/linkage/show-hide) - 学习联动功能
