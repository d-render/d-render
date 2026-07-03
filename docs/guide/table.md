# 表格 Table

`CipTable` 用于渲染数据表格，支持可编辑单元格。

## 基本使用

```vue
<template>
  <DrTable v-model:data="tableData" :columns="columns" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableData = ref([
  { name: '张三', age: 25, sex: 1 },
  { name: '李四', age: 30, sex: 2 }
])

const columns = generateFieldList({
  name: { type: 'input', label: '姓名' },
  age: { type: 'number', label: '年龄' },
  sex: { 
    type: 'radio', 
    label: '性别',
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  }
})
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 表格数据（支持 v-model） |
| columns | Array | [] | 列配置 |
| editType | string | - | 编辑类型：row / all |
| selectable | boolean | false | 是否显示选择列 |
| showIndex | boolean | false | 是否显示序号列 |
| height | string/number | - | 表格高度 |
| maxHeight | string/number | - | 最大高度 |

## 编辑模式

### 行编辑

```vue
<DrTable :editType="'row'" :columns="columns" />
```

点击行进入编辑模式。

### 全表编辑

```vue
<DrTable :editType="'all'" :columns="columns" />
```

所有单元格都可编辑。

## 可写列配置

需要设置 `writable: true`：

```js
{
  name: { 
    type: 'input', 
    label: '姓名',
    writable: true 
  }
}
```

## 表格专属配置

### columnType

列类型：
- `checkbox` - 复选框列
- `mainField` - 主要字段（加粗显示）

```js
{
  name: { 
    type: 'input', 
    label: '姓名',
    columnType: 'mainField'
  }
}
```

### hideItem

隐藏该列。

```js
{
  id: {
    type: 'input',
    label: 'ID',
    hideItem: true
  }
}
```

### dynamic

**重要**：只读列要响应 dependOn 必须开启。

```js
{
  education: {
    type: 'select',
    label: '学历',
    writable: false,
    dependOn: ['sex'],
    dynamic: true,  // 必须开启
    changeConfig: (config, { sex }) => {
      config.writable = !!sex
      return config
    }
  }
}
```

### fixed

固定列。

```js
{
  name: {
    type: 'input',
    label: '姓名',
    fixed: 'left'  // 或 'right'
  }
}
```

### minWidth

最小宽度。

```js
{
  description: {
    type: 'textarea',
    label: '描述',
    minWidth: '200px'
  }
}
```

### align

对齐方式。

```js
{
  amount: {
    type: 'number',
    label: '金额',
    align: 'right'
  }
}
```

### showOverflowTooltip

超出显示 tooltip。

```js
{
  description: {
    type: 'textarea',
    label: '描述',
    showOverflowTooltip: true
  }
}
```

### selectable

控制复选框是否可选。

```js
{
  // 在表格配置中
  selectable: ({ row, index }) => {
    return row.status !== 'deleted'
  }
}
```

## 表格中的联动

### 依赖表格外字段

使用 `outDependOn`：

```js
{
  table: {
    type: 'table',
    columns: [
      {
        key: 'city',
        config: {
          type: 'select',
          label: '城市',
          outDependOn: ['province'],
          changeConfig: (config, values, outValues) => {
            console.log('外层省份:', outValues.province)
            return config
          }
        }
      }
    ]
  }
}
```

### 列间联动

```js
const columns = generateFieldList({
  province: {
    type: 'select',
    label: '省份',
    writable: true,
    asyncOptions: async () => {
      return await fetchProvinces()
    }
  },
  city: {
    type: 'select',
    label: '城市',
    writable: true,
    dependOn: ['province'],
    resetValue: true,
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCities(province)
    }
  }
})
```

## 事件

```vue
<DrTable 
  :columns="columns"
  @selection-change="handleSelectionChange"
  @row-click="handleRowClick"
/>
```

## 完整示例

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
      :selectable="true"
      :showIndex="true"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableData = ref([])
const editType = ref('row')
const selectedRows = ref([])

const columns = generateFieldList({
  name: { 
    type: 'input', 
    label: '姓名',
    columnType: 'mainField',
    writable: true,
    fixed: 'left'
  },
  age: { 
    type: 'number', 
    label: '年龄',
    writable: true,
    align: 'center'
  },
  sex: { 
    type: 'select', 
    label: '性别',
    writable: true,
    options: [
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ]
  },
  province: {
    type: 'select',
    label: '省份',
    writable: true,
    asyncOptions: async () => {
      return await fetchProvinces()
    }
  },
  city: {
    type: 'select',
    label: '城市',
    writable: true,
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
  },
  remark: {
    type: 'input',
    label: '备注',
    writable: true,
    showOverflowTooltip: true,
    minWidth: '200px'
  }
})

const handleAdd = () => {
  tableData.value.push({})
}

const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}
</script>
```

## 列筛选

### 基本配置

通过列配置的 `filters`、`filterMultiple`、`filterMethod` 等开启表头筛选，对应 Element Plus TableColumn 的同名属性。

```js
const columns = generateFieldList({
  status: {
    type: 'select',
    label: '状态',
    filters: [
      { text: '启用', value: '1' },
      { text: '禁用', value: '0' }
    ],
    filterMultiple: false,        // 单选筛选
    filterMethod: (value, row) => row.status === value
  },
  tags: {
    type: 'select',
    label: '标签',
    filters: [
      { text: 'VIP', value: 'vip' },
      { text: '新客', value: 'new' }
    ],
    filterMultiple: true,         // 多选筛选（默认）
    filterMethod: (value, row) => row.tags?.includes(value)
  }
})
```

| 列配置 | 说明 |
|--------|------|
| `filters` | 筛选项，`[{ text, value }]` |
| `filterMultiple` | 是否多选，默认 `true` |
| `filterMethod` | 自定义筛选函数 `(value, row, column) => boolean` |
| `filteredValue` | 初始选中值，`string[]` |
| `filterPlacement` | 筛选面板位置，也可用简写 `filter: 'top'` |
| `columnKey` | 列数据字段名；用于单元格绑定与 `v-model:filterModel` 同步，默认等于列 `key`；`filter-change` 仍使用列 `key` |

### 与搜索表单同步（v-model:filterModel）

`DrTable` 提供 `v-model:filterModel`，可直接与 `DrSearchForm` 的 `model` 共用，用户点击表头筛选时自动回写，单选列为 `string`、多选列为 `string[]`：

```vue
<template>
  <DrSearchForm v-model:model="searchModel" :fieldList="searchFields" @search="loadData" />
  <DrTable
    v-model:data="tableData"
    v-model:filterModel="searchModel"
    :columns="columns"
  />
</template>

<script setup>
import { ref } from 'vue'

// 表格筛选会写入 status / tags 字段，与搜索表单共用
const searchModel = ref({ name: '', status: '', tags: [] })
</script>
```

`filterModel` 更新时只会合并筛选相关字段，不会覆盖 `name`、`date` 等其它搜索条件。

### 性能注意事项

`DrTable` 内部依赖 Vue 3 的**属性级响应式**来保持筛选转换的窄依赖：只有 `filterModel` 中**筛选字段**变化时才会触发表格重渲染，非筛选字段（如 `name`）变化不会影响表格。

为此，更新 `filterModel` 时请**原地修改属性**，而非创建新对象：

```js
// ✅ 推荐：原地修改，属性级响应式可精准触发
searchModel.value.status = '1'

// ❌ 避免：每次创建新对象，会导致 filterModel 引用整体变化
//          从而触发不必要的表格重渲染
searchModel.value = { ...searchModel.value, status: '1' }
```

> `DrSearchForm` 内部已采用原地修改模式，正常使用 `v-model:model` 不会有此问题。
> 该注意事项仅针对使用方手动修改 `filterModel` 的场景。

