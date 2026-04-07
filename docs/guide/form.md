# 表单 Form

`CipForm` 是 d-render 的核心组件，用于渲染表单。

## 基本使用

```vue
<template>
  <DrForm 
    v-model:model="model" 
    :fieldList="fieldList"
    @submit="handleSubmit"
  />
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
  }
}))

const handleSubmit = () => {
  console.log('表单数据:', model.value)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Object | - | 表单数据（支持 v-model） |
| fieldList | Array | [] | 字段配置列表 |
| grid | number \| boolean | 1 | 栅格列数，true 时 PC 端为 3，移动端为 1 |
| labelPosition | string | - | label 位置：left / right / top |
| border | boolean | - | 是否显示边框 |
| showOnly | boolean | false | 是否只读模式 |
| scrollToError | boolean | true | 验证失败时滚动到错误位置 |
| equipment | string | 'pc' | 设备类型：pc / mobile |
| enterHandler | Function | - | 回车触发事件 |
| useDirectory | boolean | false | 是否开启目录导航 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:model | (model) | 数据更新 |
| submit | - | 提交事件（配合 CipFormLayout） |
| cancel | - | 取消事件（配合 CipFormLayout） |

## Methods

通过 ref 调用：

```js
const formRef = ref()

// 验证表单
await formRef.value.validate()

// 验证单个字段
formRef.value.validateField(['name', 'age'])

// 清除验证
formRef.value.clearValidate()

// 验证上传
await formRef.value.validateUpload()
```

## 栅格布局

### 固定列数

```vue
<DrForm :grid="3" :fieldList="fieldList" />
```

### 自动列数

```vue
<DrForm :grid="true" :fieldList="fieldList" />
```

- PC 端：3 列
- 移动端：1 列

### 字段跨列

```js
{
  description: {
    type: 'textarea',
    label: '描述',
    span: 2  // 占用 2 列
  }
}
```

## 只读模式

```vue
<DrForm :showOnly="true" :fieldList="fieldList" />
```

所有字段将渲染为只读视图。

## 带边框模式

```vue
<DrForm :border="true" :showOnly="true" :fieldList="fieldList" />
```

适合详情展示场景。

## 表单目录

```vue
<DrForm :useDirectory="true" :fieldList="fieldList" />
```

需要字段配置中设置 `directory`：

```js
{
  basicInfo: {
    type: 'card',
    label: '基本信息',
    directory: 1  // 目录层级
  }
}
```

## 插槽

### 字段插槽

覆盖整个表单项：

```vue
<DrForm :fieldList="fieldList">
  <template #name="{ key, config }">
    <div>自定义 name 字段</div>
  </template>
</DrForm>
```

### 输入组件插槽

只覆盖输入组件：

```vue
<DrForm :fieldList="fieldList">
  <template #nameInput="{ fieldKey, modelValue, updateModelValue }">
    <el-input 
      :modelValue="modelValue" 
      @update:modelValue="updateModelValue"
    />
  </template>
</DrForm>
```

## 验证

### 必填验证

```js
{
  name: {
    type: 'input',
    label: '姓名',
    required: true,
    requiredErrorMessage: '请输入姓名'
  }
}
```

### 正则验证

```js
{
  email: {
    type: 'input',
    label: '邮箱',
    regexpValidate: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    regexpValidateErrorMessage: '请输入正确的邮箱格式'
  }
}
```

### 内置验证类型

```js
{
  mobile: {
    type: 'input',
    label: '手机号',
    validateValue: 'mobilePhone',
    validateValueErrorMessage: '请输入正确的手机号'
  }
}
```

支持的类型：
- `email` - 邮箱
- `mobilePhone` - 手机号
- `identityCard` - 身份证

### 自定义验证

```js
{
  username: {
    type: 'input',
    label: '用户名',
    customValidators: [
      {
        type: 'custom',
        message: '用户名已存在',
        async validator(value, dependOnValues, outDependOnValues) {
          const res = await checkUsername(value)
          return { data: res.available }
        }
      }
    ]
  }
}
```

## 完整示例

```vue
<template>
  <DrForm
    ref="formRef"
    v-model:model="model"
    :fieldList="fieldList"
    :grid="3"
    :border="true"
  >
    <template #avatarInput="{ fieldKey, modelValue, updateModelValue }">
      <el-upload
        :modelValue="modelValue"
        @update:modelValue="updateModelValue"
      />
    </template>
  </DrForm>
  
  <el-button @click="handleSubmit">提交</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const formRef = ref()
const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  avatar: {
    type: 'input',
    label: '头像'
  },
  name: {
    type: 'input',
    label: '姓名',
    required: true,
    span: 2
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
  },
  email: {
    type: 'input',
    label: '邮箱',
    validateValue: 'email'
  },
  description: {
    type: 'textarea',
    label: '简介',
    span: 3
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
