# 组件事件

## DrForm 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:model | `(model: object)` | 表单数据更新 |
| submit | - | 提交事件（配合 CipFormLayout） |
| cancel | - | 取消事件（配合 CipFormLayout） |

## DrSearchForm 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:model | `(model: object)` | 搜索数据更新 |
| search | `(model: object)` | 点击搜索按钮 |

```vue
<template>
  <DrSearchForm 
    v-model:model="searchModel" 
    :fieldList="fieldList"
    @search="handleSearch"
  />
</template>

<script setup>
const handleSearch = (model) => {
  console.log('搜索条件:', model)
}
</script>
```

## DrTable 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:data | `(data: array)` | 表格数据更新 |
| select | `(selection: array, row: object)` | 选择变化 |
| select-all | `(selection: array)` | 全选变化 |
| selection-change | `(selection: array)` | 选择变化 |
| cell-mouse-enter | `(row, column, cell, event)` | 单元格鼠标进入 |
| cell-mouse-leave | `(row, column, cell, event)` | 单元格鼠标离开 |
| cell-click | `(row, column, cell, event)` | 单元格点击 |
| cell-dblclick | `(row, column, cell, event)` | 单元格双击 |
| row-click | `(row, column, event)` | 行点击 |
| row-contextmenu | `(row, column, event)` | 行右键 |
| row-dblclick | `(row, column, event)` | 行双击 |
| header-click | `(column, event)` | 表头点击 |
| header-contextmenu | `(column, event)` | 表头右键 |
| sort-change | `({ column, prop, order })` | 排序变化 |
| filter-change | `(filters)` | 筛选变化，`filters` 为 Element Plus 格式 `Record<string, string[]>`，key 为列 `key` |
| update:filterModel | `(model)` | 筛选变化时触发，`model` 为搜索表单友好格式（单选 `string`、多选 `string[]`），配合 `v-model:filterModel` 使用 |
| current-change | `(currentRow, oldCurrentRow)` | 当前行变化 |
| header-dragend | `(newWidth, oldWidth, column, event)` | 列宽拖动 |

```vue
<template>
  <DrTable 
    v-model:data="tableData" 
    :columns="columns"
    @selection-change="handleSelectionChange"
    @row-click="handleRowClick"
    @sort-change="handleSortChange"
  />
</template>

<script setup>
const handleSelectionChange = (selection) => {
  console.log('选中行:', selection)
}

const handleRowClick = (row, column) => {
  console.log('点击行:', row)
}

const handleSortChange = ({ prop, order }) => {
  console.log('排序:', prop, order)
}
</script>
```

## DrFormItem 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:model | `(model: object)` | 数据更新 |

## 字段级别事件

在字段配置中可以通过 dependOn 实现字段级别的事件处理：

```js
{
  name: {
    type: 'input',
    label: '姓名',
    dependOn: ['age'],
    changeValue: ({ age }) => {
      // 当 age 变化时执行
      console.log('age changed:', age)
      return { value: '' }
    }
  }
}
```

或使用 `changeEffect` 拦截值更新：

```js
{
  amount: {
    type: 'number',
    label: '金额',
    changeEffect: async (value, key, model) => {
      // 可以在这里做异步校验
      if (value > 10000) {
        const confirmed = await showConfirm('金额超过 10000，确认吗？')
        return confirmed
      }
      return true
    }
  }
}
```
