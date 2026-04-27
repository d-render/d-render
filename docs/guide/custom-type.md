# 自定义 type

d-render 允许你注册自定义组件类型，扩展框架能力。

## 自定义 type 的本质

**自定义 type = 向 DRender 注册一个新的组件映射。**

## 最简示例

### 1. 创建组件配置文件

```js
// src/components/custom-input/component-config.js
export default {
  myInput: {
    component: (mode) => () => import(`./my-input${mode}`)
  }
}
```

### 2. 在 d-render.config.js 中注册

```js
import customInputsPlugin from '@/components/custom-input/component-config'

export default {
  plugins: [
    customInputsPlugin
  ]
}
```

### 3. 使用自定义类型

```js
const fieldList = generateFieldList({
  username: {
    type: 'myInput',
    label: '用户名'
  }
})
```

## 注册配置详解

### 基本格式

```js
{
  [typeName]: {
    component: (mode) => () => import(`./path/to/component${mode}`)
  }
}
```

### 多模式支持

组件可以注册多个渲染模式：

- 默认模式：`/index`
- 只读模式：`/view`
- 移动端模式：`/mobile`
- 配置模式：`/configure`

```js
{
  mySelect: {
    component: (mode) => () => import(`./my-select${mode}`)
  }
}
```

目录结构：
```
my-select/
├── index.vue       # 默认模式
├── view.vue        # 只读模式
├── mobile.vue      # 移动端模式
└── configure.vue   # 配置模式
```

如果某个模式不存在，会 fallback 到默认组件。

### 布局类型

如果是布局组件，需要标记 `layout: true`：

```js
{
  myLayout: {
    component: (mode) => () => import(`./my-layout${mode}`),
    layout: true
  }
}
```

## 自定义组件开发指南

### 使用 useFormInput hook（推荐）

```vue
<template>
  <el-input 
    v-model="proxyValue"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
  />
</template>

<script setup>
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, proxyOtherValue, width } = useFormInput(props, emit, {
  maxOtherKey: 2
})
</script>
```

### useFormInput 提供的能力

- `proxyValue` - 主字段值的响应式代理
- `proxyOtherValue` - otherKey 值的响应式代理数组
- `width` - 字段宽度
- `securityConfig` - 安全的配置对象

### 组件 props

使用 `formInputProps` 会自动包含：

- `modelValue` - 主值
- `otherValue` - 附加值
- `config` - 字段配置对象
- `dependOnValues` - 依赖值对象
- `outDependOnValues` - 外部依赖值对象

### 组件 emits

使用 `formInputEmits` 会自动包含：

- `update:modelValue` - 更新主值
- `update:otherValue` - 更新附加值

## 支持联动

### 响应依赖变化

```vue
<script setup>
import { watch } from 'vue'
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, securityConfig } = useFormInput(props, emit)

// 监听依赖变化
watch(() => props.dependOnValues, (values) => {
  if (securityConfig.value.autoFill && values.province) {
    proxyValue.value = getDefaultCity(values.province)
  }
}, { deep: true })
</script>
```

### 提供异步选项

```vue
<script setup>
import { ref, watch } from 'vue'
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, securityConfig } = useFormInput(props, emit)
const options = ref([])

// 组件配置中声明 asyncOptions（与 TAsyncOptions 一致，可传第三参 extra，如 remote 的 query）
const loadOptions = async () => {
  const fn = securityConfig.value.asyncOptions
  if (typeof fn === 'function') {
    options.value = await fn(props.dependOnValues, props.outDependOnValues)
  }
}

watch(() => props.dependOnValues, loadOptions, { immediate: true })
</script>
```

## 支持 otherKey

### 单个 otherKey

```vue
<script setup>
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, proxyOtherValue } = useFormInput(props, emit, {
  maxOtherKey: 1
})

const handleChange = (value, label) => {
  proxyValue.value = value
  proxyOtherValue[0].value = label
}
</script>
```

### 多个 otherKey

```vue
<script setup>
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, proxyOtherValue } = useFormInput(props, emit, {
  maxOtherKey: 3
})

const handleChange = (value, label, option, path) => {
  proxyValue.value = value
  proxyOtherValue[0].value = label
  proxyOtherValue[1].value = option
  proxyOtherValue[2].value = path
}
</script>
```

## 完整示例：带搜索的选择器

```vue
<template>
  <el-select
    v-model="proxyValue"
    filterable
    remote
    :remote-method="handleSearch"
    :loading="loading"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    />
  </el-select>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormInput, formInputProps, formInputEmits } from '@d-render/shared'

const props = defineProps(formInputProps)
const emit = defineEmits(formInputEmits)

const { proxyValue, proxyOtherValue, securityConfig } = useFormInput(props, emit, {
  maxOtherKey: 2
})

const loading = ref(false)
const options = ref([])

const valueKey = computed(() => securityConfig.value.valueKey || 'value')
const labelKey = computed(() => securityConfig.value.labelKey || 'label')

// 搜索方法
const handleSearch = async (query) => {
  if (!query) {
    options.value = []
    return
  }
  
  loading.value = true
  try {
    if (securityConfig.value.remoteMethod) {
      options.value = await securityConfig.value.remoteMethod(query)
    }
  } finally {
    loading.value = false
  }
}

// 选择时更新主值和 otherKey
const handleChange = (value) => {
  const selected = options.value.find(item => item[valueKey.value] === value)
  proxyOtherValue[0].value = selected?.[labelKey.value]
  proxyOtherValue[1].value = selected
}

// 支持联动
watch(() => props.dependOnValues, () => {
  proxyValue.value = undefined
  proxyOtherValue[0].value = undefined
  proxyOtherValue[1].value = undefined
  options.value = []
}, { deep: true })
</script>
```

注册配置：

```js
export default {
  searchSelect: {
    component: (mode) => () => import(`./search-select${mode}`)
  }
}
```

使用：

```js
{
  userId: {
    type: 'searchSelect',
    label: '用户',
    otherKey: ['userName', 'userOption'],
    placeholder: '请输入关键词搜索',
    valueKey: 'id',
    labelKey: 'name',
    remoteMethod: async (query) => {
      const res = await searchUser(query)
      return res.data
    }
  }
}
```

## 配置模式组件

配置模式用于设计器中配置字段属性。

```vue
<template>
  <div class="my-input-configure">
    <el-form-item label="占位文本">
      <el-input v-model="config.placeholder" />
    </el-form-item>
    <el-form-item label="最大长度">
      <el-input-number v-model="config.maxLength" />
    </el-form-item>
  </div>
</template>

<script setup>
defineProps({
  config: Object
})
</script>
```

## 最佳实践

### 1. 始终使用 useFormInput

避免自己处理复杂的值同步逻辑。

### 2. 明确 otherKey 顺序

在组件文档中清楚说明 otherKey 数组每个位置的含义。

### 3. 支持常用配置

至少支持：
- `placeholder`
- `disabled`
- `readonly`

### 4. 处理联动

如果组件是选项类，支持：
- `dependOn` 触发重新加载
- `asyncOptions` 异步获取选项

### 5. 提供配置模式

如果组件有特殊配置，提供 configure 模式。

### 6. 提供只读模式

view 模式用于详情展示。

### 7. 提供移动端模式

mobile 模式适配移动端 UI。

## 常见问题

### Q: 组件加载失败？

A: 检查动态导入路径是否正确，确保文件存在。

### Q: 配置不生效？

A: 确保在应用启动前调用 `dRender.setConfig()`。

### Q: otherKey 不工作？

A: 检查是否正确使用了 `useFormInput` 并设置了 `maxOtherKey`。

### Q: 如何支持验证？

A: 使用 d-render 内置的验证机制，在配置中设置 `required`、`regexpValidate` 等。
