# otherKey 详解

`otherKey` 是 d-render 中容易被误用但非常重要的字段，用于处理组件的额外输出值。

## otherKey 是什么

一个输入组件不一定只产出一个值。很多选择类组件实际有更多信息：

- value - 选中的值
- label - 选中的标签
- option - 选中的完整选项对象
- path - 树形选择时的路径

`model[fieldKey]` 不够装，就用 `otherKey` 接收额外值。

```js
{
  userId: {
    type: 'select',
    label: '用户',
    otherKey: 'userName'
  }
}
```

当选择某个用户时：
- `model.userId = 1` (主值)
- `model.userName = '张三'` (附加值)

## otherKey 的类型

`otherKey` 支持两种类型：

### 单个字符串

```js
{
  userId: {
    otherKey: 'userName'
  }
}
```

### 字符串数组

```js
{
  deptId: {
    otherKey: ['deptName', 'deptOption']
  }
}
```

## otherKey 的常见用途

### 场景 1：select 同时存 value 和 label

```js
{
  userId: {
    type: 'select',
    label: '用户',
    otherKey: 'userName',
    options: [
      { value: 1, label: '张三' },
      { value: 2, label: '李四' }
    ]
  }
}
```

选择"张三"时：
```js
model.userId = 1
model.userName = '张三'
```

### 场景 2：select 同时存 value、label、完整对象

```js
{
  deptId: {
    type: 'select',
    otherKey: ['deptName', 'deptOption']
  }
}
```

- 第一个 `otherKey` 接收 label
- 第二个 `otherKey` 接收完整的 option 对象

### 场景 3：树形选择存路径

```js
{
  deptId: {
    type: 'cascader',
    otherKey: ['deptName', 'deptOption', 'deptPath']
  }
}
```

- 第一个：label
- 第二个：option 对象
- 第三个：树路径数组

### 场景 4：日期范围拆成两个字段

```js
{
  dateRange: {
    type: 'dateRange',
    label: '日期范围',
    otherKey: 'endDate'
  }
}
```

- 主字段：开始日期
- `otherKey`：结束日期

## otherKey 是按顺序接值的

**重要**：`otherKey` 数组按顺序接收组件输出的附加值。

```js
otherKey: ['label', 'option', 'path']
```

表示：
1. 第一个接收 label
2. 第二个接收 option 对象
3. 第三个接收 path

顺序必须和组件内部输出顺序一致。

## otherKey 是否所有 type 都支持

**配置层都能写，实际是否生效取决于该 type 组件有没有主动输出附加值。**

- 普通 input 通常不会生成额外值
- select / cascader 等选择类组件更常用

## otherKey 在自定义组件里如何支持

### 使用 useFormInput hook

```js
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

export default {
  props: formInputProps,
  emits: formInputEmits,
  setup(props, ctx) {
    const { proxyValue, proxyOtherValue } = useFormInput(props, ctx, { maxOtherKey: 2 })
    
    // proxyValue.value 对应主字段
    // proxyOtherValue[0].value 对应 otherKey[0]
    // proxyOtherValue[1].value 对应 otherKey[1]
    
    return {
      proxyValue,
      proxyOtherValue
    }
  }
}
```

### 手动实现

如果你想自己处理：

```js
export default {
  props: ['modelValue', 'otherValue', 'config'],
  emits: ['update:modelValue', 'update:otherValue'],
  setup(props, { emit }) {
    const handleChange = (value, label) => {
      emit('update:modelValue', value)
      emit('update:otherValue', label)
    }
    
    return { handleChange }
  }
}
```

## otherKey 与 dependOn 的组合

### 组合 1：联动时同时清空主值和 otherKey

```js
{
  cityId: {
    type: 'select',
    otherKey: 'cityName',
    dependOn: ['provinceId'],
    resetValue: true  // 同时清空 cityId 和 cityName
  }
}
```

### 组合 2：联动时同时更新主值和 otherKey

```js
{
  cityId: {
    type: 'select',
    otherKey: 'cityName',
    dependOn: ['provinceId'],
    changeValue: ({ provinceId }) => {
      if (!provinceId) {
        return {
          value: undefined,
          otherValue: undefined
        }
      }
    }
  }
}
```

### 组合 3：完整级联示例

```js
{
  provinceId: {
    type: 'select',
    label: '省份',
    otherKey: 'provinceName',
    asyncOptions: async () => {
      return await fetchProvinceOptions()
    }
  },
  cityId: {
    type: 'select',
    label: '城市',
    otherKey: ['cityName', 'cityOption'],
    dependOn: ['provinceId'],
    resetValue: true,
    changeConfig: (config, { provinceId }) => {
      config.disabled = !provinceId
      return config
    },
    asyncOptions: async ({ provinceId }) => {
      if (!provinceId) return []
      return await fetchCityOptions(provinceId)
    }
  }
}
```

## otherKey 开发规范建议

### 单附加值

```js
otherKey: 'userName'
```

### 双附加值

```js
otherKey: ['userName', 'userOption']
```

表示：
1. 第一个接 label
2. 第二个接完整 option

### 树形三附加值

```js
otherKey: ['deptName', 'deptOption', 'deptPath']
```

表示：
1. label
2. option
3. path

### 规范要点

1. **顺序约定要稳定** - 同一个 type 的 otherKey 顺序必须固定
2. **文档化** - 在组件文档中明确说明 otherKey 的顺序含义
3. **命名语义化** - otherKey 的命名要能表达其含义

## 常见问题

### Q: otherKey 值没有更新？

A: 检查：
1. 该 type 组件是否支持输出附加值
2. 是否使用了 `useFormInput` 或正确实现了输出协议
3. `otherKey` 配置的字段名是否正确

### Q: otherKey 数组顺序错了？

A: `otherKey` 是按位置对应的，不是按字段名语义识别。确保顺序和组件输出顺序一致。

### Q: 如何知道组件输出几个附加值？

A: 查看组件文档或源码，看它调用了几次 `updateOtherValue` 或 `proxyOtherValue` 的索引。

### Q: changeValue 时如何设置 otherValue？

A: 返回对象包含 `otherValue` 字段：

```js
changeValue: (values) => ({
  value: newValue,
  otherValue: newOtherValue
})
```

## otherKey 底层实现原理

### CipFormItem 层

```ts
// 主值
const [modelValue, updateModelValue] = useFieldValue(fieldKey, model, updateModelQueue, changeEffect)

// otherKey
const otherKey = computed(() => formItemConfig.value?.otherKey)
const [otherValue, updateOtherValue] = useFieldValue(otherKey, model, updateModelQueue)
```

### useFieldValue 支持数组

```ts
// otherKey 为数组时
if (isArrayKey.value) {
  (key.value as Array<string>).forEach(k => {
    updateModelQueue.append(k, getFieldValue(val || {}, k))
  })
}
```

这意味着 `otherKey` 可以是多个字段，组件内部输出的附加值会按顺序写入。
