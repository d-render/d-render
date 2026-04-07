# 表格基础示例

本示例展示如何使用 d-render 创建可编辑表格，支持行编辑和全表编辑。

## 效果演示

<TableDemo />

## 核心概念

### 表格类型

d-render 的表格本质上是由多个表单项组成的，每个单元格都是一个 `CipFormItem`。

### 编辑模式

- **行编辑**：点击行的编辑按钮，该行进入编辑状态
- **全表编辑**：所有单元格都可编辑

## 基础用法

### 1. 定义列配置

```js
import { generateFieldList } from 'd-render'

const columns = generateFieldList({
  name: { 
    type: 'input', 
    label: '姓名',
    writable: true  // 可编辑
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
```

### 2. 使用表格

```vue
<template>
  <DrTable 
    v-model:data="tableData" 
    :columns="columns"
    :editType="editType"
  />
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { name: '张三', age: 25, sex: 1 },
  { name: '李四', age: 30, sex: 2 }
])

const editType = ref('row')  // 'row' | 'all'
</script>
```

## 完整示例

```vue
<template>
  <div>
    <!-- 操作栏 -->
    <div style="margin-bottom: 16px">
      <el-radio-group v-model="editType">
        <el-radio-button value="row">行编辑</el-radio-button>
        <el-radio-button value="all">全表编辑</el-radio-button>
      </el-radio-group>
      
      <el-button type="primary" style="margin-left: 16px" @click="addRow">
        添加行
      </el-button>
      
      <el-button @click="saveAll" :disabled="editType !== 'all'">
        保存全部
      </el-button>
    </div>

    <!-- 表格 -->
    <DrTable
      ref="tableRef"
      v-model:data="tableData"
      :columns="columns"
      :editType="editType"
      :selectable="true"
      :showIndex="true"
      @selection-change="handleSelectionChange"
    />

    <!-- 批量操作 -->
    <div style="margin-top: 16px">
      <el-button 
        type="danger" 
        :disabled="selectedRows.length === 0"
        @click="batchDelete"
      >
        批量删除 ({{ selectedRows.length }})
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList } from 'd-render'

const tableRef = ref()
const tableData = ref([])
const editType = ref('row')
const selectedRows = ref([])

const columns = generateFieldList({
  name: { 
    type: 'input', 
    label: '姓名',
    writable: true,
    columnType: 'mainField',  // 主要字段，加粗显示
    fixed: 'left'             // 固定在左侧
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
  phone: {
    type: 'input',
    label: '手机号',
    writable: true
  },
  email: {
    type: 'input',
    label: '邮箱',
    writable: true,
    showOverflowTooltip: true  // 超出显示 tooltip
  },
  remark: {
    type: 'input',
    label: '备注',
    writable: true,
    minWidth: '200px'
  }
})

// 添加行
const addRow = () => {
  tableData.value.push({
    name: '',
    age: null,
    sex: null,
    phone: '',
    email: '',
    remark: ''
  })
}

// 保存全部
const saveAll = async () => {
  try {
    // 验证所有数据
    await validateAll()
    // 提交到后端
    await saveTableData(tableData.value)
    console.log('保存成功')
  } catch (e) {
    console.error('保存失败:', e)
  }
}

// 批量删除
const batchDelete = () => {
  const ids = selectedRows.value.map(row => row.id)
  tableData.value = tableData.value.filter(row => !ids.includes(row.id))
  selectedRows.value = []
}

// 选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}
</script>
```

## 表格专属配置

### columnType

列类型，用于特殊显示：

```js
{
  name: {
    columnType: 'mainField'  // 主要字段，加粗显示
  }
}
```

### fixed

固定列：

```js
{
  name: {
    fixed: 'left'  // 固定在左侧
  },
  action: {
    fixed: 'right'  // 固定在右侧
  }
}
```

### align

对齐方式：

```js
{
  age: {
    align: 'center'  // 居中
  },
  amount: {
    align: 'right'   // 右对齐
  }
}
```

### showOverflowTooltip

超出显示 tooltip：

```js
{
  description: {
    showOverflowTooltip: true
  }
}
```

### dynamic

**重要**：只读列要响应联动必须开启：

```js
{
  city: {
    type: 'select',
    writable: false,  // 只读
    dependOn: ['province'],
    dynamic: true,    // 必须开启才能响应联动
    changeConfig: (config, { province }) => {
      config.writable = !!province
      return config
    }
  }
}
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | Array | [] | 表格数据 |
| `columns` | Array | [] | 列配置 |
| `editType` | string | - | 编辑类型：row / all |
| `selectable` | boolean | false | 是否显示选择列 |
| `showIndex` | boolean | false | 是否显示序号列 |
| `height` | string/number | - | 表格高度 |
| `maxHeight` | string/number | - | 最大高度 |

## 方法

通过 ref 调用表格方法：

```js
const tableRef = ref()

// 清除选择
tableRef.value.clearSelection()

// 切换行选择
tableRef.value.toggleRowSelection(row, true)

// 切换全选
tableRef.value.toggleAllSelection()

// 重新布局
tableRef.value.doLayout()
```

## 小结

- ✅ 使用 `generateFieldList` 创建列配置
- ✅ 通过 `writable` 设置可编辑
- ✅ 通过 `editType` 切换编辑模式
- ✅ 使用 `fixed` 固定列
- ✅ 使用 `dynamic` 开启只读列联动
- ✅ 结合 `selectable` 实现批量操作

## 下一步

- [显示隐藏示例](/examples/linkage/show-hide) - 学习联动功能
- [表格联动示例](/examples/advanced/table-linkage) - 学习表格内联动
