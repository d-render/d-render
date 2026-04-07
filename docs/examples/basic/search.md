# 搜索表单示例

本示例展示如何使用 d-render 创建搜索表单，支持即时搜索、自动折叠等功能。

## 效果演示

<SearchFormDemo />

## 核心特性

### 1. 即时搜索

字段变更时自动触发搜索：

```js
{
  status: {
    type: 'select',
    label: '状态',
    immediateSearch: true,  // 变更时立即搜索
    options: [...]
  }
}
```

### 2. 自动折叠

超过一行自动折叠，点击展开：

```vue
<DrSearchForm 
  :collapse="true"    // 开启自动折叠
  :fieldList="fieldList"
/>
```

### 3. 重置功能

重置到默认搜索条件：

```vue
<DrSearchForm 
  :searchReset="true"
  :defaultModel="{ status: 1 }"  // 重置时使用此默认值
  @search="handleSearch"
/>
```

## 基础用法

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
    placeholder: '请输入关键词搜索'
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
    otherKey: 'createEndTime'  // 结束时间
  }
}))

const handleSearch = (model) => {
  // 调用接口搜索
  fetchData(model)
}
</script>
```

## 高级配置

### 栅格布局

```vue
<!-- 固定列数 -->
<DrSearchForm :grid="4" />

<!-- 自动适配 -->
<DrSearchForm :grid="'auto'" />
```

### 隐藏搜索按钮

```vue
<DrSearchForm :hideSearch="true" />
```

### 自定义按钮文字

```vue
<DrSearchForm searchButtonText="查询" />
```

## 完整示例

```vue
<template>
  <div>
    <!-- 搜索表单 -->
    <DrSearchForm
      v-model:model="searchModel"
      :fieldList="fieldList"
      :collapse="true"
      :searchReset="true"
      :defaultModel="defaultSearch"
      @search="handleSearch"
    />

    <!-- 数据表格 -->
    <DrTable 
      v-model:data="tableData"
      :columns="columns"
      style="margin-top: 16px"
    />

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      @current-change="handleSearch"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { generateFieldList, defineSearchFieldConfig } from 'd-render'

const defaultSearch = {
  status: 1
}

const searchModel = ref({ ...defaultSearch })

const fieldList = generateFieldList(defineSearchFieldConfig({
  keyword: {
    type: 'input',
    label: '关键词',
    placeholder: '名称/编码/描述'
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
  category: {
    type: 'select',
    label: '分类',
    options: [
      { value: '', label: '全部' },
      { value: 1, label: '电子产品' },
      { value: 2, label: '服装' }
    ]
  },
  createTime: {
    type: 'dateRange',
    label: '创建时间',
    otherKey: 'createEndTime'
  },
  updateTime: {
    type: 'dateRange',
    label: '更新时间',
    otherKey: 'updateEndTime'
  }
}))

const tableData = ref([])

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

const handleSearch = async () => {
  try {
    const res = await fetchDataList({
      ...searchModel.value,
      page: pagination.page,
      size: pagination.size
    })
    tableData.value = res.data
    pagination.total = res.total
  } catch (e) {
    console.error('获取数据失败:', e)
  }
}

// 初始化加载数据
handleSearch()
</script>
```

## 搜索表单专属配置

| 配置项 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| `immediateSearch` | boolean | 变更时立即搜索 | `false` |
| `autoSelect` | boolean | 自动选择第一个选项 | `false` |

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `grid` | number \| 'auto' | 'auto' | 栅格列数 |
| `collapse` | boolean | true | 超过一行是否自动折叠 |
| `hideSearch` | boolean | false | 是否隐藏搜索按钮 |
| `searchReset` | boolean | - | 是否显示重置按钮 |
| `searchButtonText` | string | - | 搜索按钮文字 |
| `defaultModel` | Object | - | 默认搜索条件 |

## 小结

- ✅ 使用 `defineSearchFieldConfig` 定义搜索表单配置
- ✅ 通过 `immediateSearch` 实现即时搜索
- ✅ 通过 `collapse` 实现自动折叠
- ✅ 通过 `otherKey` 处理日期范围
- ✅ 结合分页组件实现完整搜索功能

## 下一步

- [表格基础示例](/examples/basic/table) - 学习表格使用
- [级联选择示例](/examples/linkage/cascade) - 学习搜索联动
