# Git Commit 规范

基于项目历史 commit 分析总结，所有 commit message 应遵循以下规范。

## 格式

```
<type>(<scope>): <subject>
```

- **type** 和 **scope** 之间无空格
- **scope** 外使用英文括号
- 冒号后紧跟一个空格
- **subject** 使用简洁的中文或英文描述，不加句号

## Type（必填）

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新增功能 | `feat(d-render): [DrForm]新增errorMode属性支持tooltip错误提示` |
| `fix` | 修复 Bug | `fix(shared): [use-form-input]修复useOptions的autoSelect功能` |
| `refactor` | 重构代码（不新增功能、不修复 Bug） | `refactor(config-util): 更新字段配置类型以改善类型安全` |
| `perf` | 性能优化 | `perf(cip-form-input): 优化样式处理和事件绑定` |
| `polish` | 样式调整、交互优化、细节完善 | `polish(design): 优化设计器样式` |
| `style` | 代码格式化（不影响逻辑） | `style(design): 格式化代码` |
| `docs` | 文档更新、changelog 记录 | `docs(changelog): d-render` |
| `chore` | 构建、依赖、配置等工程化变更 | `chore: 版本升级及发布准备` |
| `build` | 构建系统变更 | `build: 添加 TypeScript 编译时的 UTF-8 编码设置` |
| `publish` | 版本发布 | `publish(d-render): 发布2.0.0的测试版本` |
| `clear` | 清理无用代码、注释、console.log | `clear(shared): 清理console.log` |

## Scope（可选但推荐）

Scope 用于说明 commit 影响的范围，优先使用包名或模块名：

### 包级 Scope

| Scope | 说明 |
|-------|------|
| `d-render` | 核心渲染组件库 |
| `shared` / `@d-render/shared` | 共享工具库 |
| `design` / `@d-render/design` | 可视化设计器 |
| `plugin-standard` | 标准插件 |
| `play` | 开发调试 Playground |
| `docs` | 文档站点 |
| `build` | 构建系统 |

### 组件级 Scope

当变更涉及具体组件时，在 scope 或 subject 中标注组件名：

| Scope | 说明 |
|-------|------|
| `cip-form` | 表单组件 |
| `cip-form-item` | 表单项组件 |
| `cip-search-form` | 搜索表单组件 |
| `cip-table` | 表格组件 |
| `config-util` | 配置工具 |
| `use-form-input` | 表单输入 Hook |

## Subject 规则

1. **组件名标注**：当变更涉及具体组件属性或方法时，使用 `[组件名]` 前缀
   - `feat(d-render): [DrForm]新增errorMode属性`
   - `fix(d-render): [cip-search-form]修复collapse判断不正确的问题`

2. **语言选择**：中文或英文均可，保持同一 commit 内语言一致

3. **描述准确**：简要说明"做了什么"，而非"怎么做的"

## 完整示例

```
feat(d-render): [DrForm]新增errorMode属性支持将错误类型调整为tooltip模式
fix(shared): [use-form-input]修复useOptions的autoSelect功能
refactor(config-util): 更新字段配置类型以改善类型安全
perf(cip-form-input): 优化样式处理和事件绑定
polish(design): 优化设计器样式
docs(changelog): d-render
chore: 版本升级及发布准备
chore(shared): 去除npm scripts
build: 添加 TypeScript 编译时的 UTF-8 编码设置
publish(d-render): 发布3.1.6
clear(shared): 清理console.log
```

## 注意事项

- 避免使用拼写错误的 type（如 `chroe`、`pref`），本项目历史中存在此类问题，后续应避免
- `docs(changelog)` 类型的 commit 用于记录 changelog 更新，由 changeset 工具或手动维护
- `chore: 版本升级及发布准备` 用于版本发布前的准备工作
- 当变更涉及多个包时，scope 可使用 `&` 连接：`refactor(d-render&shared): js->ts`
