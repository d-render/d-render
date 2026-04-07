# 示例

这里提供了 d-render 的完整示例，从基础到高级，让你快速上手。

## 示例结构

```
examples/
├── basic/        # 基础示例
│   ├── form      - 表单基础
│   ├── search    - 搜索表单
│   └── table     - 表格基础
├── linkage/      # 联动示例
│   ├── show-hide - 显示隐藏
│   ├── cascade   - 级联选择
│   └── derive    - 值派生
└── advanced/     # 高级示例
    ├── custom       - 自定义组件
    ├── complex      - 复杂表单
    └── table-linkage - 表格联动
```

## 快速导航

### 🌱 基础示例

- [表单基础](/examples/basic/form) - 学习表单的基本使用
- [搜索表单](/examples/basic/search) - 学习搜索表单和即时搜索
- [表格基础](/examples/basic/table) - 学习可编辑表格

### 🔄 联动示例

- [显示隐藏](/examples/linkage/show-hide) - 学习字段的显示/隐藏联动
- [级联选择](/examples/linkage/cascade) - 学习省市县三级联动
- [值派生](/examples/linkage/derive) - 学习自动计算字段值

### 🚀 高级示例

- [自定义组件](/examples/advanced/custom) - 学习开发自定义 type
- [复杂表单](/examples/advanced/complex) - 学习处理复杂表单场景
- [表格联动](/examples/advanced/table-linkage) - 学习表格内的字段联动

## 学习路径

```
表单基础 → 搜索表单 → 表格基础
    ↓
显示隐藏 → 级联选择 → 值派生
    ↓
自定义组件 → 复杂表单 → 表格联动
```

## 常见问题

### 如何快速开始？

从[表单基础](/examples/basic/form)开始，了解最基本的使用方式。

### 如何实现联动？

查看[显示隐藏](/examples/linkage/show-hide)和[级联选择](/examples/linkage/cascade)示例。

### 如何自定义组件？

查看[自定义组件](/examples/advanced/custom)和[自定义 type](/guide/custom-type)文档。

## 核心概念速查

| 功能 | 配置 | 说明 |
|------|------|------|
| 指定组件类型 | `type` | `'input'`, `'select'`, `'radio'` 等 |
| 字段依赖 | `dependOn` | 指定依赖的其他字段 |
| 修改配置 | `changeConfig` | 依赖变化时修改配置 |
| 修改值 | `changeValue` | 依赖变化时修改值 |
| 清空值 | `resetValue` | 依赖变化时清空 |
| 异步选项 | `asyncOptions` | 异步加载选项 |
| 额外输出 | `otherKey` | 输出额外字段值 |

## 需要帮助？

- 📖 查看[官方文档](https://d-render.github.io/d-render/)
- 💬 提交 [Issue](https://github.com/d-render/d-render/issues)
