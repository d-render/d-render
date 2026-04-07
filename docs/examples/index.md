# 示例

## 表单基础

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

## 表单联动

### 显示/隐藏联动

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
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
}))
</script>
```

### 级联选择

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

// 模拟接口
const fetchProvinces = async () => {
  return [
    { value: 1, label: '北京' },
    { value: 2, label: '上海' },
    { value: 3, label: '广东' }
  ]
}

const fetchCities = async (provinceId) => {
  const cityMap = {
    1: [{ value: 101, label: '朝阳区' }, { value: 102, label: '海淀区' }],
    2: [{ value: 201, label: '浦东新区' }, { value: 202, label: '黄浦区' }],
    3: [{ value: 301, label: '广州市' }, { value: 302, label: '深圳市' }]
  }
  return cityMap[provinceId] || []
}

const fieldList = generateFieldList(defineFormFieldConfig({
  province: {
    type: 'select',
    label: '省份',
    otherKey: 'provinceName',
    asyncOptions: fetchProvinces
  },
  city: {
    type: 'select',
    label: '城市',
    otherKey: 'cityName',
    dependOn: ['province'],
    resetValue: true,
    changeConfig: (config, { province }) => {
      config.disabled = !province
      return config
    },
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCities(province)
    }
  }
}))
</script>
```

## 搜索表单

```vue
<template>
  <DrSearchForm 
    v-model:model="searchModel" 
    :fieldList="fieldList"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineSearchFieldConfig } from 'd-render'

const searchModel = ref({})

const fieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    placeholder: '请输入名称'
  },
  status: {
    type: 'select',
    label: '状态',
    immediateSearch: true,
    options: [
      { value: '', label: '全部' },
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ]
  },
  createTime: {
    type: 'dateRange',
    label: '创建时间',
    otherKey: 'createEndTime'
  }
}))

const handleSearch = (model) => {
  console.log('搜索条件:', model)
}
</script>
```

## 可编辑表格

```vue
<template>
  <div>
    <div style="margin-bottom: 16px;">
      <el-button @click="handleAdd">新增</el-button>
      <el-button @click="editType = 'all'">全表编辑</el-button>
      <el-button @click="editType = 'row'">行编辑</el-button>
    </div>
    
    <DrTable
      v-model:data="tableData"
      :columns="columns"
      :editType="editType"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableData = ref([])
const editType = ref('row')

const columns = generateFieldList({
  name: { 
    type: 'input', 
    label: '姓名',
    writable: true
  },
  age: { 
    type: 'number', 
    label: '年龄',
    writable: true
  },
  sex: { 
    type: 'select', 
    label: '性别',
    writable: true,
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
})

const handleAdd = () => {
  tableData.value.push({})
}
</script>
```

## 自定义 type

### 注册自定义组件

```js
// d-render.config.js
import { defineDRenderConfig } from 'd-render'

export default defineDRenderConfig({
  components: {
    myInput: {
      component: (mode) => () => import(`./components/my-input${mode}`)
    }
  }
})
```

### 自定义组件实现

```vue
<template>
  <div class="my-input">
    <el-input
      v-model="proxyValue"
      :placeholder="config.placeholder"
      :disabled="config.disabled"
    >
      <template #append>
        <el-button @click="handleClick">搜索</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, securityConfig } = useFormInput(props, emit)

const handleClick = () => {
  console.log('点击搜索:', proxyValue.value)
}
</script>
```

### 使用自定义组件

```js
const fieldList = generateFieldList({
  search: {
    type: 'myInput',
    label: '搜索',
    placeholder: '请输入关键词'
  }
})
```

## 表格联动

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

## 验证示例

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
