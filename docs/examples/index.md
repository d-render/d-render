# 示例

## 基础示例

### 表单基础

<iframe src="https://codesandbox.io/embed/d-render-form-basic?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="d-render-form-basic"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### 表单联动

<iframe src="https://codesandbox.io/embed/d-render-form-dependon?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="d-render-form-dependon"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### 搜索表单

<iframe src="https://codesandbox.io/embed/d-render-search-form?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="d-render-search-form"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### 可编辑表格

<iframe src="https://codesandbox.io/embed/d-render-table-editable?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="d-render-table-editable"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## 进阶示例

### 自定义 type

查看[自定义 type](/guide/custom-type) 了解如何开发自定义组件。

### 复杂联动

```js
// 三级联动
const fieldList = generateFieldList(defineFormFieldConfig({
  province: {
    type: 'select',
    label: '省份',
    otherKey: 'provinceName',
    asyncOptions: async () => {
      return await fetchProvinceOptions()
    }
  },
  city: {
    type: 'select',
    label: '城市',
    otherKey: ['cityName', 'cityOption'],
    dependOn: ['province'],
    resetValue: true,
    changeConfig: (config, { province }) => {
      config.disabled = !province
      return config
    },
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCityOptions(province)
    }
  },
  district: {
    type: 'select',
    label: '区县',
    otherKey: 'districtName',
    dependOn: ['city'],
    resetValue: true,
    changeConfig: (config, { city }) => {
      config.disabled = !city
      return config
    },
    asyncOptions: async ({ city }) => {
      if (!city) return []
      return await fetchDistrictOptions(city)
    }
  }
}))
```

### 动态表单

```vue
<template>
  <DrForm :fieldList="dynamicFieldList" />
</template>

<script setup>
import { computed } from 'vue'
import { generateFieldList } from 'd-render'

const formType = ref('simple')

const dynamicFieldList = computed(() => {
  const base = [
    { key: 'name', config: { type: 'input', label: '姓名' } }
  ]
  
  if (formType.value === 'full') {
    base.push(
      { key: 'age', config: { type: 'number', label: '年龄' } },
      { key: 'sex', config: { type: 'radio', label: '性别' } }
    )
  }
  
  return base
})
</script>
```
