# 数据联动

数据联动是 d-render 最核心的特性之一，通过 `dependOn` 机制实现字段间的联动。

## dependOn 是什么

`dependOn` 指定当前字段依赖哪些字段，这些依赖字段变化时，可以触发当前字段的配置变化或值变化。

```js
{
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province']
  }
}
```

## dependOn 的两种写法

### 字符串数组

```js
{
  city: {
    dependOn: ['province', 'country']
  }
}
```

触发**当前字段配置上的全局联动函数**：
- `changeConfig`
- `changeValue`
- `resetValue`
- `changeValueByOld`
- `asyncOptions`

### 对象数组

```js
{
  city: {
    dependOn: [{
      key: 'province',
      effect: {
        changeValue: ({ province }) => ({
          value: province ? `${province}-derived` : ''
        })
      }
    }]
  }
}
```

适合：一个字段依赖多个源，但每个源触发的行为不同。

## dependOn 能做什么

### 1. changeConfig：修改当前字段配置

当依赖字段变化时，动态修改当前字段的配置。

```js
{
  b: {
    label: 'B',
    dependOn: ['a'],
    hideItem: true,
    changeConfig: (config, { a }) => {
      config.hideItem = a === 1
      return config
    }
  }
}
```

**重要**：`changeConfig` 必须返回 config。

可修改的配置包括：
- `hideItem` - 是否隐藏
- `disabled` - 是否禁用
- `writable` - 是否可写
- `required` - 是否必填
- `options` - 选项列表
- `placeholder` - 占位文本
- 以及其他当前 type 支持的配置

### 2. changeValue：修改当前字段值

当依赖字段变化时，动态修改当前字段的值。

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

返回值格式：
```js
{
  value,      // 写入主字段
  otherValue  // 写入 otherKey 字段
}
```

### 3. resetValue：清空值

当依赖字段变化时，清空当前字段值。

```js
{
  city: {
    type: 'select',
    dependOn: ['province'],
    resetValue: true
  }
}
```

适用场景：上级选项变化时，下级选项需要重选。

**注意**：`resetValue` 会同时清空主字段和 `otherKey` 字段。

### 4. changeValueByOld：基于旧值联动

当你需要知道旧值是什么时使用。

```js
{
  city: {
    type: 'select',
    dependOn: ['province'],
    changeValueByOld: ({ key, oldValue }, values) => {
      console.log('变化的字段:', key)
      console.log('旧值:', oldValue)
      console.log('当前所有依赖值:', values)
      return { value: '' }
    }
  }
}
```

### 5. asyncOptions：动态拉取选项

最常用的联动方式之一。

```js
{
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCityOptions(province)
    }
  }
}
```

## dependOn 触发时传入的 values

回调函数会接收一个对象，包含所有依赖字段的值：

```js
{
  city: {
    dependOn: ['province', 'country'],
    changeConfig: (config, { province, country }) => {
      console.log('省份:', province)
      console.log('国家:', country)
      return config
    }
  }
}
```

## immediateChangeValue

控制初始化时是否执行 `changeValue`。

```js
{
  city: {
    dependOn: ['province'],
    immediateChangeValue: true,
    changeValue: ({ province }) => ({
      value: getDefaultCity(province)
    })
  }
}
```

默认：初始化阶段不执行，只有真实变更后才执行。

## outDependOn

依赖当前作用域外部的数据，常用于：
- table 子项依赖表单外层字段
- 嵌套结构中子层依赖父层字段

```js
{
  table: {
    type: 'table',
    columns: [
      {
        key: 'city',
        config: {
          type: 'select',
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

## 联动最佳实践

### 控制显示隐藏

```js
{
  detail: {
    type: 'input',
    dependOn: ['type'],
    changeConfig: (config, { type }) => {
      config.hideItem = type !== 'custom'
      return config
    }
  }
}
```

### 控制禁用状态

```js
{
  city: {
    type: 'select',
    dependOn: ['province'],
    changeConfig: (config, { province }) => {
      config.disabled = !province
      return config
    }
  }
}
```

### 级联选择

```js
{
  province: {
    type: 'select',
    label: '省份',
    asyncOptions: async () => {
      return await fetchProvinceOptions()
    }
  },
  city: {
    type: 'select',
    label: '城市',
    dependOn: ['province'],
    resetValue: true,
    changeConfig: (config, { province }) => {
      config.disabled = !province
      return config
    },
    asyncOptions: async ({ province }) => {
      if (!province) return []
      return await fetchCityOptions(province)
    }
  },
  district: {
    type: 'select',
    label: '区县',
    dependOn: ['city'],
    resetValue: true,
    changeConfig: (config, { city }) => {
      config.disabled = !city
      return config
    },
    asyncOptions: async ({ city }) => {
      if (!city) return []
      return await fetchDistrictOptions(city)
    }
  }
}
```

### 动态派生值

```js
{
  discount: {
    type: 'number',
    label: '折扣'
  },
  price: {
    type: 'number',
    label: '原价'
  },
  finalPrice: {
    type: 'number',
    label: '最终价格',
    dependOn: ['discount', 'price'],
    changeValue: ({ discount = 100, price = 0 }) => ({
      value: price * discount / 100
    })
  }
}
```

## 表格中的联动注意点

表格只读列默认不会响应 `dependOn`，需要开启 `dynamic: true`。

```js
{
  education: {
    type: 'select',
    label: '学历',
    writable: false,  // 只读
    dependOn: ['sex'],
    dynamic: true,    // 必须开启才能响应联动
    changeConfig: (config, { sex }) => {
      config.writable = !!sex
      return config
    }
  }
}
```

## dependOn 规范建议

### 简单依赖：用字符串数组

```js
dependOn: ['a']
```

适合：
- 改 visible / disabled / required
- 改 options
- 简单 reset

### 复杂依赖：用对象数组

```js
dependOn: [
  {
    key: 'a',
    effect: {
      changeConfig: (config) => config
    }
  }
]
```

适合：
- 多依赖源有不同副作用
- 想区分某个源变化时只执行局部 effect

### 选择合适的联动方式

- 只改配置 → `changeConfig`
- 改值 → `changeValue`
- 上游切换后必须重选 → `resetValue`
