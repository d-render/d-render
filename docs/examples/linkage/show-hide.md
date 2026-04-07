# 显示隐藏示例

本示例展示如何通过 `dependOn` 和 `changeConfig` 实现字段的显示/隐藏联动。

## 效果演示

<FormDependonDemo />

## 核心概念

### dependOn

指定当前字段依赖哪些其他字段：

```js
{
  companyName: {
    dependOn: ['type']  // 依赖 type 字段
  }
}
```

### changeConfig

当依赖字段变化时，修改当前字段的配置：

```js
{
  companyName: {
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'  // 根据条件隐藏
      return config  // 必须返回 config
    }
  }
}
```

## 常见场景

### 场景 1：单选控制显示

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  type: {
    type: 'radio',
    label: '类型',
    options: [
      { value: 'personal', label: '个人' },
      { value: 'company', label: '企业' }
    ]
  },
  companyName: {
    type: 'input',
    label: '企业名称',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'
      return config
    }
  },
  creditCode: {
    type: 'input',
    label: '统一社会信用代码',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'company'
      config.required = type === 'company'  // 同时设置必填
      return config
    }
  }
}))
</script>
```

### 场景 2：多选控制显示

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  features: {
    type: 'checkbox',
    label: '功能特性',
    options: [
      { value: 'sms', label: '短信通知' },
      { value: 'email', label: '邮件通知' },
      { value: 'push', label: '推送通知' }
    ]
  },
  smsConfig: {
    type: 'input',
    label: '短信签名',
    dependOn: ['features'],
    changeConfig: (config, { features }) => {
      // features 是数组
      config.hideItem = !features?.includes('sms')
      return config
    }
  },
  emailConfig: {
    type: 'input',
    label: '邮件服务器',
    dependOn: ['features'],
    changeConfig: (config, { features }) => {
      config.hideItem = !features?.includes('email')
      return config
    }
  },
  pushConfig: {
    type: 'input',
    label: '推送服务',
    dependOn: ['features'],
    changeConfig: (config, { features }) => {
      config.hideItem = !features?.includes('push')
      return config
    }
  }
}))
</script>
```

### 场景 3：选择控制多个字段

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  hasExperience: {
    type: 'switch',
    label: '是否有工作经验'
  },
  company: {
    type: 'input',
    label: '公司名称',
    dependOn: ['hasExperience'],
    changeConfig: (config, { hasExperience }) => {
      config.hideItem = !hasExperience
      return config
    }
  },
  position: {
    type: 'input',
    label: '职位',
    dependOn: ['hasExperience'],
    changeConfig: (config, { hasExperience }) => {
      config.hideItem = !hasExperience
      return config
    }
  },
  years: {
    type: 'number',
    label: '工作年限',
    dependOn: ['hasExperience'],
    changeConfig: (config, { hasExperience }) => {
      config.hideItem = !hasExperience
      return config
    }
  }
}))
</script>
```

### 场景 4：复杂条件控制

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  userType: {
    type: 'select',
    label: '用户类型',
    options: [
      { value: 'vip', label: 'VIP用户' },
      { value: 'svip', label: '超级VIP' },
      { value: 'normal', label: '普通用户' }
    ]
  },
  amount: {
    type: 'number',
    label: '消费金额',
    dependOn: ['userType'],
    changeConfig: (config, { userType }) => {
      // VIP 和超级VIP 显示
      config.hideItem = userType === 'normal'
      return config
    }
  },
  discount: {
    type: 'select',
    label: '折扣',
    options: [
      { value: 0.9, label: '9折' },
      { value: 0.8, label: '8折' },
      { value: 0.7, label: '7折' }
    ],
    dependOn: ['userType'],
    changeConfig: (config, { userType }) => {
      // 只有超级VIP 显示
      config.hideItem = userType !== 'svip'
      return config
    }
  }
}))
</script>
```

## 同时修改多个配置

`changeConfig` 可以同时修改多个配置项：

```js
{
  companyName: {
    type: 'input',
    label: '企业名称',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      const isCompany = type === 'company'
      
      config.hideItem = !isCompany          // 是否隐藏
      config.required = isCompany           // 是否必填
      config.disabled = false               // 是否禁用
      config.placeholder = isCompany 
        ? '请输入企业名称' 
        : ''
      
      return config
    }
  }
}
```

## 可修改的配置项

在 `changeConfig` 中可以修改：

| 配置项 | 说明 |
|--------|------|
| `hideItem` | 是否隐藏 |
| `disabled` | 是否禁用 |
| `required` | 是否必填 |
| `writable` | 是否可写 |
| `placeholder` | 占位文本 |
| `options` | 选项列表 |
| `defaultValue` | 默认值 |
| 以及其他 type 支持的配置 |

## 注意事项

### 1. 必须返回 config

```js
// ❌ 错误：没有返回
changeConfig: (config) => {
  config.hideItem = true
}

// ✅ 正确：返回 config
changeConfig: (config) => {
  config.hideItem = true
  return config
}
```

### 2. 不要修改原对象

```js
// ❌ 可能有问题
changeConfig: (config) => {
  config = { ...config, hideItem: true }
  return config
}

// ✅ 推荐
changeConfig: (config) => {
  config.hideItem = true
  return config
}
```

### 3. 处理 undefined

依赖值可能是 undefined：

```js
changeConfig: (config, { type }) => {
  config.hideItem = type !== 'company'  // type 可能是 undefined
  return config
}

// 更安全的写法
changeConfig: (config, { type }) => {
  config.hideItem = type !== 'company'
  // 或者
  config.hideItem = !['company'].includes(type)
  return config
}
```

## 小结

- ✅ 使用 `dependOn` 指定依赖字段
- ✅ 使用 `changeConfig` 修改配置
- ✅ 通过 `hideItem` 控制显示隐藏
- ✅ 可以同时修改多个配置
- ✅ 必须返回 config

## 下一步

- [级联选择示例](/examples/linkage/cascade) - 学习级联联动
- [值派生示例](/examples/linkage/derive) - 学习值派生
