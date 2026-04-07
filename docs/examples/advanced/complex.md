# 复杂表单示例

本示例展示如何处理复杂的表单场景。

## 场景：用户注册表单

包含：基本信息、联系方式、工作经历等多个部分。

```vue
<template>
  <DrForm
    v-model:model="model"
    :fieldList="fieldList"
    :grid="3"
    label-width="120px"
  >
    <template #avatarInput="{ modelValue, updateModelValue }">
      <el-upload
        :model-value="modelValue"
        @update:model-value="updateModelValue"
      />
    </template>
  </DrForm>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  // 基本信息
  _basic: { type: 'staticInfo', staticInfo: '基本信息' },
  avatar: { type: 'input', label: '头像', span: 3 },
  name: { type: 'input', label: '姓名', required: true, span: 2 },
  sex: {
    type: 'radio',
    label: '性别',
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  },
  birthDate: { type: 'date', label: '出生日期' },

  // 联系方式
  _contact: { type: 'staticInfo', staticInfo: '联系方式' },
  phone: { type: 'input', label: '手机号', validateValue: 'mobilePhone', required: true },
  email: { type: 'input', label: '邮箱', validateValue: 'email' },
  address: { type: 'input', label: '地址', span: 2 },

  // 工作信息
  _work: { type: 'staticInfo', staticInfo: '工作信息' },
  hasExperience: { type: 'switch', label: '是否有工作经验' },
  company: {
    type: 'input',
    label: '公司',
    dependOn: ['hasExperience'],
    changeConfig: (config, { hasExperience }) => {
      config.hideItem = !hasExperience
      config.required = hasExperience
      return config
    }
  },
  position: {
    type: 'input',
    label: '职位',
    dependOn: ['hasExperience'],
    changeConfig: (config, { hasExperience }) => {
      config.hideItem = !hasExperience
      return config
    }
  }
}))
</script>
```

## 小结

- ✅ 使用 `staticInfo` 分组
- ✅ 使用 `span` 控制布局
- ✅ 使用插槽自定义渲染
- ✅ 使用联动控制显示
