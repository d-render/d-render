# 组件方法

## DrForm 方法

通过 ref 调用表单方法：

```vue
<template>
  <DrForm ref="formRef" :fieldList="fieldList" />
  <el-button @click="validate">验证</el-button>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref()

const validate = async () => {
  try {
    await formRef.value.validate()
    console.log('验证通过')
  } catch (e) {
    console.log('验证失败')
  }
}
</script>
```

### validate

验证整个表单。

```ts
async validate(): Promise<boolean>
```

返回值：
- 验证通过：resolve `true`
- 验证失败：reject

### validateField

验证指定字段。

```ts
validateField(props: string[], callback?: Function): void
```

参数：
- `props` - 字段名数组
- `callback` - 回调函数

### clearValidate

清除验证信息。

```ts
clearValidate(props?: string[]): void
```

参数：
- `props` - 字段名数组，不传则清除所有

### validateUpload

验证上传中的文件。

```ts
async validateUpload(): Promise<boolean>
```

返回值：
- 所有上传完成：resolve `true`
- 有上传中：resolve `false`

## DrSearchForm 方法

### reset

重置搜索条件。

```ts
reset(): void
```

### expand

切换展开/收起。

```ts
expand(): void
```

## DrTable 方法

### clearSelection

清除选择。

```ts
clearSelection(): void
```

### toggleRowSelection

切换行选择。

```ts
toggleRowSelection(row: any, selected?: boolean): void
```

### toggleAllSelection

切换全选。

```ts
toggleAllSelection(): void
```

### setCurrentRow

设置当前行。

```ts
setCurrentRow(row: any): void
```

### clearSort

清除排序。

```ts
clearSort(): void
```

### clearFilter

清除筛选。

```ts
clearFilter(columnKey?: string): void
```

### doLayout

重新布局。

```ts
doLayout(): void
```

### sort

手动排序。

```ts
sort(prop: string, order: 'ascending' | 'descending'): void
```
