# 搜索表单 SearchForm

`CipSearchForm` 用于渲染搜索表单，常用于列表页的搜索筛选。

## 基本使用

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
    label: '关键词'
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
  console.log('搜索:', val)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| model | Object | - | 搜索数据（支持 v-model） |
| fieldList | Array | [] | 字段配置列表 |
| grid | number \| 'auto' | 'auto' | 栅格列数，auto 时自动适配宽度 |
| labelPosition | string | - | label 位置 |
| hideSearch | boolean | false | 是否隐藏搜索按钮 |
| handleAbsolute | boolean | - | 操作按钮是否绝对定位 |
| collapse | boolean | true | 超过一行是否自动收缩 |
| searchButtonText | string | - | 搜索按钮文字 |
| searchReset | boolean | - | 是否显示重置按钮 |
| equipment | string | 'pc' | 设备类型 |
| defaultModel | Object | - | 默认搜索条件（重置时使用） |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:model | (model) | 数据更新 |
| search | (model) | 点击搜索按钮 |

## 自动栅格

搜索表单支持根据容器宽度自动调整列数：

```vue
<DrSearchForm :grid="'auto'" :fieldList="fieldList" />
```

## 折叠展开

默认超过一行自动折叠，点击"展开"显示更多：

```vue
<DrSearchForm :collapse="true" :fieldList="fieldList" />
```

禁用折叠：

```vue
<DrSearchForm :collapse="false" :fieldList="fieldList" />
```

## 即时搜索

配置 `immediateSearch` 实现变更即搜索：

```js
{
  keyword: {
    type: 'input',
    label: '关键词',
    immediateSearch: true
  }
}
```

## 重置功能

```vue
<DrSearchForm 
  :searchReset="true"
  :defaultModel="{ status: 1 }"
  @search="handleSearch"
/>
```

点击重置会恢复到 `defaultModel` 的值。

## 搜索表单专属配置

### immediateSearch

变更时立即触发搜索。

```js
{
  status: {
    type: 'select',
    label: '状态',
    immediateSearch: true,
    options: [...]
  }
}
```

### autoSelect

选项类组件自动选择第一个选项。

```js
{
  category: {
    type: 'select',
    label: '分类',
    autoSelect: true,
    asyncOptions: async () => {
      return await fetchCategories()
    }
  }
}
```

## 完整示例

```vue
<template>
  <DrSearchForm
    v-model:model="searchModel"
    :fieldList="searchFieldList"
    :collapse="true"
    :searchReset="true"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineSearchFieldConfig } from 'd-render'

const searchModel = ref({
  status: 1  // 默认值
})

const searchFieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    placeholder: '请输入名称/编码'
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
  },
  category: {
    type: 'select',
    label: '分类',
    dependOn: ['status'],
    asyncOptions: async ({ status }) => {
      return await fetchCategories({ status })
    }
  }
}))

const handleSearch = (val) => {
  // 调用接口搜索
  fetchData(val)
}
</script>
```
