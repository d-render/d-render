# d-render

## 2.1.18

### Patch Changes

- fix(table): 修复 thead 的中 icon 与文字的对齐问题

## 2.1.17

### Patch Changes

- fix(table): 修复表头中的提示图标
- fix(form-item): 修复 outDependOn 中的字段也判断是否和当前字段一样的问题

## 2.1.16

### Patch Changes

- fix(form-item): 修复 dependOn 收集逻辑错误导致 outDependOn 无法正常执行的问题

## 2.1.15

### Patch Changes

- dd9594f: fix(d-render&shared): 补充历史版本中存在的 ts 类型
- c4b9191: fix(cip-form): 支持 label-width
- 78b3acc: feat(cip-table): columns[number].config 中支持\_\_render 用于自定义渲染
- b383391: fix(cip-form): 修复`labelSuffix`属性不生效的问题
- 3a42787: polish(表单设计): 修改子表单样式
- 9cffcf3: refactor(d-render&shared): 使用 typescript 重写
- cb26e67: fix(cip-form-item): 修复 useModleChange 在更新多值时的 bug
- 1f0361c: fix(@d-render/design): 解决 tooltip 在手机端预览时偏移的问题
- bb37322: chore(d-render): 修改版本号后重新发布
- a820c6e: feat(cip-table): 扩展功能，新增 columnType: mainField 及 onMainFieldClick 事件
- 63ac231: fix(d-render): [cip-table]修复 fieldKey 的配置错误
- 17508f1: pref(cip-table): 优化 mainField 的时组件的使用方式
- 4ff59dd: fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题
- a30ad30: feat(cip-form-item): 新增 inParent、parentDependOnValues 属性
- 8ee6e2c: feat(cip-search-form): 支持搜索前数据验证
- 0d064aa: fix(d-render): [dependOn]修复副作用只能出发一次的问题
- Updated dependencies [dd9594f]
- Updated dependencies [9cffcf3]
- Updated dependencies [4ff59dd]
- Updated dependencies [53fcd96]
- Updated dependencies [78b3acc]
- Updated dependencies [2dbc067]
  - @d-render/shared@1.2.4

## 2.1.15-beta.16

### Patch Changes

- feat(cip-form-item): 新增 inParent、parentDependOnValues 属性

## 2.1.15-beta.15

### Patch Changes

- fix(@d-render/design): 解决 tooltip 在手机端预览时偏移的问题

## 2.1.15-beta.14

### Patch Changes

- feat(cip-table): columns[number].config 中支持\_\_render 用于自定义渲染
- Updated dependencies
  - @d-render/shared@1.2.4-beta.6

## 2.1.15-beta.13

### Patch Changes

- fix(design): 修复设计器的字段配置清空后再输入第一个值后会失焦的问题
- Updated dependencies
  - @d-render/shared@1.2.4-beta.5

## 2.1.15-beta.12

### Patch Changes

- chore(d-render): 修改版本号后重新发布

## 2.1.15-beta.11

### Patch Changes

- fix(cip-form): 修复`labelSuffix`属性不生效的问题

## 2.1.15-beta.10

### Patch Changes

- polish(表单设计): 修改子表单样式

## 2.1.15-beta.9

### Patch Changes

- pref(cip-table): 优化 mainField 的时组件的使用方式

## 2.1.15-beta.8

### Patch Changes

- fix(cip-form-item): 修复 useModleChange 在更新多值时的 bug

## 2.1.15-beta.7

### Patch Changes

- feat(cip-table): 扩展功能，新增 columnType: mainField 及 onMainFieldClick 事件

## 2.1.15-beta.6

### Patch Changes

- fix(cip-form): 支持 label-width

## 2.1.15-beta.5

### Patch Changes

- feat(cip-search-form): 支持搜索前数据验证

## 2.1.15-beta.4

### Patch Changes

- fix(d-render): [dependOn]修复副作用只能出发一次的问题

## 2.1.15-beta.3

### Patch Changes

- fix(d-render&shared): 补充历史版本中存在的 ts 类型
- Updated dependencies
  - @d-render/shared@1.2.4-beta.3

## 2.1.15-beta.2

### Patch Changes

- fix(d-render): [cip-table]修复 fieldKey 的配置错误

## 2.1.15-beta.1

### Patch Changes

- refactor(d-render&shared): 使用 typescript 重写
- Updated dependencies
  - @d-render/shared@1.2.4-beta.1

## 2.1.14

### Patch Changes

- perf(cip-form-item): 优化 deepClone config 的逻辑

## 2.1.13

### Patch Changes

- fix(d-render): [cip-form-item]修复 span 的逻辑错误

## 2.1.12

### Patch Changes

- refactor(d-render): [cip-form-item]去除 grid 为 true 的转换逻辑,此部分由父组件直接转换

## 2.1.11

### Patch Changes

- fix(d-render): [cip-form]修复 grid 值小于字段配置中的 span 时导致的展示异常

## 2.1.10

### Patch Changes

- feat(d-render): [cip-form-item]允许通过 itemMarginBottom 的控制项的底部外边距

## 2.1.9

### Patch Changes

- fix(style): 修复 labelPosition 为 top 时 label 宽度过长导致意外的 label for 效果

## 2.1.8

### Patch Changes

- feat(styles): 扩展对 form-label 部分的背景色控制

## 2.1.7

### Patch Changes

- fix(styles): 修复 cip-button-text 存在 padding 导致宽度超过预期导致换行的问题

## 2.1.6

### Patch Changes

- fix(d-render): [cip-table]控制按钮的间距为 8px

## 2.1.5

### Patch Changes

- fix(d-render): [cip-search-form]修复直接使用 collapse 导致的问题

## 2.1.4

### Patch Changes

- fix(d-render): [cip-search-form]修复 collapse 的判断不争气的问题

## 2.1.3

### Patch Changes

- chore(cip-table): 修复一个小错误

## 2.1.2

### Patch Changes

- refactor(d-render): [cip-table]: 调整 config 的值为数字,调整 transformWidth

## 2.1.1

### Patch Changes

- feat(cip-table): 当 border 为 true 是 columns 的 width 会比默认的多 1

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
