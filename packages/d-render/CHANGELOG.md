# d-render

## 2.1.0

### Minor Changes

- feat(\*): 接入 xdpConfig 配置,可多更多的默认值进行修改

## 2.0.7

### Patch Changes

- feat(cip-table): 增加对 dangerButton 的控制,默认为不实用 danger 按钮

## 2.0.6

### Patch Changes

- fix(d-render): [cip-search-form]修复配置的--cip-form-label-color 不生效的问题

## 2.0.5

### Patch Changes

- feat(d-render): [cip-table] 支持通过`showDisabledButton`控制 table 中 disabled 的按钮是否展示。 需要@xdp/button >= 1.0.6

## 2.0.4

### Patch Changes

- feat(d-render): [cip-form-item]`tooltip`支持 cipConfig 配置 effect

## 2.0.2

### Patch Changes

- fix(d-render): 修复`form-layout`中的 modelValue 拼写错误的问题

## 2.0.1

### Patch Changes

- fix(d-render): 修改默认容器类型判断，使其为 pc 端

## 2.0.0

### Patch Changes

- feat(d-render): `form-layout`支持受控的布局组件
- Updated dependencies
  - @d-render/shared@1.1.3

## 1.1.15 (2023-05-23)

- chore(d-render): 杂项调整，无功能变化

## 1.1.14 (2023-05-23)

- pref(d-render): 替换所有使用`.el-icon-xx`的图标,采用`@element-plus/icons-vue`中导出的图标

## 1.1.13 (2023-05-22)

- fix(d-render): 修复`CipSearchForm`在传入 defaultModel 后，如果修改 model 的值，defaultModel 的信息将会写入到 model 中
  - ps: 此处其实不算 bug,但是为了少改项目已有左右结构的页面代码给予支持

## 1.1.12 (2023-05-22)

- fix(packages): 修复升级 11 版本后无法通过 `import 'd-redner/style'`的方式引入 d-render 的样式
  - 此为兼容性修复，11 版本可以通过 `import 'd-render/dist/index.css'`的方式 i 引入

## 1.1.11 (2023-05-19)

- fix(components): [cip-form-item]修复了 changeValue 在特殊情况下不能如设计的运行方式运行
  - 此 bug 出现在 CipForm 渲染后第一次修改 model 对象后 changeValue 不能如设计的不执行
  - 此 bug 修复后主要影响独立的修改页中需要立即执行的 changeValue 的属性,此中情况应明确添加属性`immediateChangeValue`

## 1.1.10 (2023-05-07)

- update(components) [cip-form-item]内部写入值时使用的 setFieldValue 方法的行为变更
  - 如在遇到 key 中带数字如 dept.0.name 时如 dept 不存在时
    - 修改前 `{dept: { 0: { name: 'value' } } }`
    - 修改后 `{dept: [ { name: 'value' } ] }`
