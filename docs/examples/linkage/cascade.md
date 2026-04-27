# 级联选择示例

本示例展示如何通过 `dependOn`、`resetValue` 和 `asyncOptions` 实现多级联动选择。

## 效果演示

<CascadeDemo />

## 核心概念

### 三大联动要素

1. **dependOn** - 指定依赖字段
2. **resetValue** - 依赖变化时清空值
3. **asyncOptions** - 异步加载选项

### 联动流程

```
国家变化 → 清空省份和城市 → 加载省份列表
省份变化 → 清空城市 → 加载城市列表
```

## 基础用法

### 两级联动

```vue
<template>
  <DrForm v-model:model="model" :fieldList="fieldList" />
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

const fieldList = generateFieldList(defineFormFieldConfig({
  province: {
    type: 'select',
    label: '省份',
    asyncOptions: async () => {
      const res = await fetch('/api/provinces')
      return res.data
    }
  },
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],     // 依赖省份
    resetValue: true,           // 省份变化时清空
    changeConfig: (config, { province }) => {
      config.disabled = !province  // 未选省份时禁用
      return config
    },
    asyncOptions: async ({ province }) => {
      if (!province) return []
      const res = await fetch(`/api/cities?province=${province}`)
      return res.data
    }
  }
}))
</script>
```

### 三级联动

```vue
<script setup>
const fieldList = generateFieldList(defineFormFieldConfig({
  province: {
    type: 'select',
    label: '省份',
    otherKey: 'provinceName',  // 同时存名称
    asyncOptions: fetchProvinces
  },
  city: {
    type: 'select',
    label: '城市',
    otherKey: ['cityName', 'cityOption'],  // 存名称和完整对象
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
  district: {
    type: 'select',
    label: '区县',
    otherKey: 'districtName',
    dependOn: ['city'],
    resetValue: true,
    changeConfig: (config, { city }) => {
      config.disabled = !city
      return config
    },
    asyncOptions: async ({ city }) => {
      if (!city) return []
      return await fetchDistricts(city)
    }
  }
}))
</script>
```

## 完整示例

```vue
<template>
  <div>
    <DrForm 
      v-model:model="model" 
      :fieldList="fieldList"
      :grid="2"
    />
    
    <div style="margin-top: 20px; padding: 16px; background: #f5f5f5">
      <h4>选择结果：</h4>
      <p>省份：{{ model.provinceName }}</p>
      <p>城市：{{ model.cityName }}</p>
      <p>区县：{{ model.districtName }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateFieldList, defineFormFieldConfig } from 'd-render'

const model = ref({})

// 模拟接口
const fetchProvinces = async () => {
  return [
    { value: 1, label: '北京' },
    { value: 2, label: '上海' },
    { value: 3, label: '广东' }
  ]
}

const fetchCities = async (provinceId) => {
  const cityMap = {
    1: [{ value: 101, label: '朝阳区' }, { value: 102, label: '海淀区' }],
    2: [{ value: 201, label: '浦东新区' }, { value: 202, label: '黄浦区' }],
    3: [{ value: 301, label: '广州市' }, { value: 302, label: '深圳市' }]
  }
  return cityMap[provinceId] || []
}

const fetchDistricts = async (cityId) => {
  const districtMap = {
    101: [{ value: 10101, label: '三里屯' }, { value: 10102, label: '国贸' }],
    102: [{ value: 10201, label: '中关村' }, { value: 10202, label: '五道口' }],
    // ... 其他城市
  }
  return districtMap[cityId] || []
}

const fieldList = generateFieldList(defineFormFieldConfig({
  province: {
    type: 'select',
    label: '省份',
    otherKey: 'provinceName',
    asyncOptions: fetchProvinces
  },
  city: {
    type: 'select',
    label: '城市',
    otherKey: 'cityName',
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
  district: {
    type: 'select',
    label: '区县',
    otherKey: 'districtName',
    dependOn: ['city'],
    resetValue: true,
    changeConfig: (config, { city }) => {
      config.disabled = !city
      return config
    },
    asyncOptions: async ({ city }) => {
      if (!city) return []
      return await fetchDistricts(city)
    }
  }
}))
</script>
```

## 配置详解

### dependOn

指定依赖的字段，可以是字符串数组或对象数组：

```js
// 字符串数组
dependOn: ['province']

// 对象数组（用于局部 effect）
dependOn: [{
  key: 'province',
  effect: {
    changeConfig: (config) => config
  }
}]
```

### resetValue

依赖变化时是否清空当前值：

```js
{
  city: {
    dependOn: ['province'],
    resetValue: true  // 省份变化时清空城市
  }
}
```

### asyncOptions

异步加载选项。函数形式与 **`TAsyncOptions`** 一致：`(dependOnValues?, outDependOnValues?, extra?) => Promise<unknown[]>`；依赖字段的值会出现在第一个参数对象中（见下方示例）。亦可配置为 **字符串**（函数体源码），供设计器序列化场景使用。

```js
{
  city: {
    asyncOptions: async ({ province }) => {
      // province 是 dependOn 字段的值
      if (!province) return []
      const res = await fetch(`/api/cities?province=${province}`)
      return res.data
    }
  }
}
```

## 高级用法

### 同时依赖多个字段

```js
{
  product: {
    type: 'select',
    label: '产品',
    dependOn: ['category', 'brand'],  // 依赖分类和品牌
    resetValue: true,
    asyncOptions: async ({ category, brand }) => {
      if (!category || !brand) return []
      return await fetchProducts(category, brand)
    }
  }
}
```

### 带默认值的联动

```js
{
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,
    asyncOptions: async ({ province }) => {
      if (!province) return []
      const cities = await fetchCities(province)
      // 如果只有一个选项，自动选择
      if (cities.length === 1) {
        // 在 nextTick 后设置值
        setTimeout(() => {
          model.value.city = cities[0].value
        }, 0)
      }
      return cities
    }
  }
}
```

### 缓存选项

```js
const cityCache = {}

const fieldList = generateFieldList(defineFormFieldConfig({
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,
    asyncOptions: async ({ province }) => {
      if (!province) return []
      
      // 使用缓存
      if (cityCache[province]) {
        return cityCache[province]
      }
      
      const cities = await fetchCities(province)
      cityCache[province] = cities
      return cities
    }
  }
}))
```

## 注意事项

### 1. resetValue 会清空 otherKey

当 `resetValue: true` 时，主字段和 `otherKey` 字段都会被清空。

### 2. 处理加载状态

可以在组件外部添加 loading 状态：

```vue
<script setup>
const loading = ref(false)

const fieldList = generateFieldList(defineFormFieldConfig({
  city: {
    asyncOptions: async ({ province }) => {
      loading.value = true
      try {
        return await fetchCities(province)
      } finally {
        loading.value = false
      }
    }
  }
}))
</script>
```

### 3. 错误处理

```js
asyncOptions: async ({ province }) => {
  try {
    const res = await fetchCities(province)
    return res.data
  } catch (e) {
    console.error('获取城市失败:', e)
    return []  // 返回空数组防止报错
  }
}
```

## 小结

- ✅ 使用 `dependOn` 指定依赖
- ✅ 使用 `resetValue` 清空下级
- ✅ 使用 `asyncOptions` 加载选项
- ✅ 使用 `changeConfig` 控制禁用状态
- ✅ 使用 `otherKey` 存储额外信息
- ✅ 建议使用缓存提升性能

## 下一步

- [值派生示例](/examples/linkage/derive) - 学习自动计算值
- [表格联动示例](/examples/advanced/table-linkage) - 学习表格内联动
