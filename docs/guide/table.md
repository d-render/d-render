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
