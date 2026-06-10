# d-render Changeset 参考

## Changelog 正文规范

- 结构：`### Added` / `### Fixed` / `### Changed`；破坏性加 `### BREAKING CHANGE`
- 可与英文 commit scope 混用（如 `feat(d-render): …`）

### 命名约定

| 范围 | 写法 |
|------|------|
| 组件 | **Dr 前缀**：`DrForm`、`DrTable`、`DrSearchForm`、`DrConfigProvider` |
| 渲染器 | `DrFormRender`、`DrTableRender` |
| 设计器 | `@d-render/design` |
| shared | hook / 工具 / 类型：`useFormInput`、`config-util`、`ITableRenderConfig` |
| 插件 | `@d-render/plugin-standard` 及 configure / mobile 注册项 |

### 包专属侧重

| 包 | 正文侧重 |
|----|----------|
| `d-render` | prop/API、插槽、`DrConfigProvider`、字段配置（`defineFormFieldConfig` 等） |
| `@d-render/shared` | hooks/utils/helper、`config-util`、`IRenderConfig` 体系 |
| `@d-render/design` | 设计器交互、schema、与渲染器联动 |
| `@d-render/plugin-standard` | 标准插件组件注册 |
| `@d-render/plugin-standard-configure` | 插件配置 UI |
| `@d-render/plugin-standard-mobile` | 移动端适配（`private`） |

类型变更须写明影响的配置接口及业务侧需调整的字段。

## Changeset 模板

### 单包

```markdown
---
"d-render": patch
---

### Fixed
- **DrSearchForm**：修复 `changeValue` 在存在 `defaultModel` 时不生效的问题。
```

### 多包

```markdown
---
"d-render": minor
"@d-render/shared": patch
---

### Added
- **DrTable**（d-render）：新增 `handlerAlign`、`handlerHeaderAlign` 控制操作列对齐。

### Changed
- **ITableRenderConfig**（shared）：优化表格字段配置类型定义。
```

## 完整示例

### d-render 组件

```markdown
---
"d-render": minor
---

### Added
- **DrSearchForm**：新增 `operationSpan`（默认 `1`）与 `operation` 插槽，支持操作区多列布局。

### Fixed
- **DrSearchForm**：修复 `changeValue` 无效的问题（`defaultModel` 合并场景）。
```

### shared + d-render 联动

```markdown
---
"@d-render/shared": minor
"d-render": patch
---

### Changed
- **配置类型体系**（shared）：拆分 `IRenderConfig` 为 `IFormRenderConfig`、`ITableRenderConfig` 等子接口；`IFormConfig` 标记废弃但仍兼容。

### Fixed
- **DrFormLayout**（d-render）：修正 `config` prop 类型为 `TFormConfig`。
```

### 仅设计器

```markdown
---
"@d-render/design": patch
---

### Fixed
- **design**：修复拖动操作被 mask 遮挡的问题。
```

## 不发包单元

| 名称 | 路径 | 说明 |
|------|------|------|
| `d-render-docs` | `docs/` | changeset `ignore` |
| `play` | `play/` | 演示工程 |
| `d-render-projects` | 根目录 | private 工作区根 |

## 其它命令

| 命令 | 用途 |
|------|------|
| `pnpm changeset` | 交互式创建（Agent 通常直接写 `.md`） |
| `pnpm gen:version` | 消费 changeset、写版本与 CHANGELOG |
| `pnpm build-all` | 构建全部发包单元 |
