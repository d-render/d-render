# 表格联动示例

本示例展示如何在表格内实现字段联动。

## 重要提示

表格只读列要响应联动，**必须**开启 `dynamic: true`。

## 示例：可编辑表格中的级联

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

const columns = generateFieldList({
  category: {
    type: 'select',
    label: '分类',
    writable: true,
    asyncOptions: async () => {
      return [
        { value: 1, label: '电子产品' },
        { value: 2, label: '服装' }
      ]
    }
  },
  product: {
    type: 'select',
    label: '产品',
    writable: true,
    dependOn: ['category'],
    resetValue: true,
    dynamic: true,  // ⚠️ 必须开启
    changeConfig: (config, { category }) => {
      config.disabled = !category
      return config
    },
    asyncOptions: async ({ category }) => {
      if (!category) return []
      const productMap = {
        1: [{ value: 101, label: '手机' }, { value: 102, label: '电脑' }],
        2: [{ value: 201, label: 'T恤' }, { value: 202, label: '裤子' }]
      }
      return productMap[category] || []
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

## outDependOn 示例

表格内的字段可以依赖表单外的字段：

```vue
<script setup>
const model = ref({
  warehouse: 'WH001'  // 仓库选择
})

const columns = generateFieldList({
  product: {
    type: 'select',
    label: '产品',
    writable: true,
    outDependOn: ['warehouse'],  // 依赖外部字段
    dynamic: true,
    changeConfig: (config, values, outValues) => {
      console.log('仓库:', outValues.warehouse)
      return config
    },
    asyncOptions: async (values, outValues) => {
      return await fetchProductsByWarehouse(outValues.warehouse)
    }
  }
})
</script>
```

## 小结

- ✅ 表格联动必须开启 `dynamic: true`
- ✅ 使用 `outDependOn` 依赖外部字段
- ✅ 使用 `resetValue` 清空下级
- ✅ 使用 `asyncOptions` 加载选项
