# 值派生示例

本示例展示如何通过 `changeValue` 和 `changeValueByOld` 自动计算字段值。

## 核心概念

### changeValue

当依赖字段变化时，自动设置当前字段的值：

```js
{
  fullName: {
    type: 'input',
    label: '全名',
    dependOn: ['firstName', 'lastName'],
    changeValue: ({ firstName, lastName }) => ({
      value: [firstName, lastName].filter(Boolean).join(' ')
    })
  }
}
```

### changeValueByOld

基于旧值计算新值：

```js
{
  total: {
    type: 'number',
    label: '总计',
    dependOn: ['items'],
    changeValueByOld: ({ key, oldValue }, values) => {
      return { value: calculateTotal(values.items) }
    }
  }
}
```

## 常见场景

### 场景 1：拼接字段

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  firstName: {
    type: 'input',
    label: '名'
  },
  lastName: {
    type: 'input',
    label: '姓'
  },
  fullName: {
    type: 'input',
    label: '全名',
    dependOn: ['firstName', 'lastName'],
    changeValue: ({ firstName, lastName }) => ({
      value: [lastName, firstName].filter(Boolean).join('')
    })
  }
}))
</script>
```

### 场景 2：计算字段

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  price: {
    type: 'number',
    label: '单价'
  },
  quantity: {
    type: 'number',
    label: '数量'
  },
  amount: {
    type: 'number',
    label: '金额',
    dependOn: ['price', 'quantity'],
    changeValue: ({ price = 0, quantity = 0 }) => ({
      value: price * quantity
    })
  }
}))
</script>
```

### 场景 3：条件派生

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  type: {
    type: 'select',
    label: '类型',
    options: [
      { value: 'personal', label: '个人' },
      { value: 'company', label: '企业' }
    ]
  },
  code: {
    type: 'input',
    label: '编码',
    dependOn: ['type'],
    changeValue: ({ type }) => ({
      value: type === 'company' ? 'COM' : 'PER'
    })
  }
}))
</script>
```

## 完整示例

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  price: {
    type: 'number',
    label: '单价',
    min: 0
  },
  quantity: {
    type: 'number',
    label: '数量',
    min: 1
  },
  discount: {
    type: 'select',
    label: '折扣',
    options: [
      { value: 1, label: '不打折' },
      { value: 0.9, label: '9折' },
      { value: 0.8, label: '8折' },
      { value: 0.7, label: '7折' }
    ],
    defaultValue: 1
  },
  subtotal: {
    type: 'number',
    label: '小计',
    dependOn: ['price', 'quantity'],
    changeValue: ({ price = 0, quantity = 0 }) => ({
      value: price * quantity
    })
  },
  total: {
    type: 'number',
    label: '合计',
    dependOn: ['subtotal', 'discount'],
    changeValue: ({ subtotal = 0, discount = 1 }) => ({
      value: Math.round(subtotal * discount * 100) / 100
    })
  }
}))
</script>
```

## 返回值说明

`changeValue` 必须返回对象：

```js
{
  value: any,        // 必填：主字段的值
  otherValue: any    // 可选：otherKey 的值
}
```

## 小结

- ✅ 使用 `changeValue` 自动计算值
- ✅ 可以依赖多个字段
- ✅ 必须返回 `{ value, otherValue? }` 对象
- ✅ 适合计算、拼接、条件派生场景

## 下一步

- [表格联动示例](/examples/advanced/table-linkage) - 学习表格内联动
