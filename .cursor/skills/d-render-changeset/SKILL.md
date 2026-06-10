---
name: d-render-changeset
description: >-
  为 d-render monorepo 分析 commit/diff、编写 Changeset、执行 pnpm gen:version
  并更新各包 CHANGELOG。适用于用户要求写 changelog、changeset、发版、版本 bump、
  总结 commit 影响，或编辑 .changeset/ 与 packages/**/CHANGELOG.md 时。
---

# d-render Changeset 发版

## 快速流程

```
任务进度：
- [ ] 1. 分析变更（commit / git diff）
- [ ] 2. 确定包与 bump 级别
- [ ] 3. 编写 .changeset/<名称>.md
- [ ] 4. 执行 pnpm gen:version（除非用户要求跳过）
- [ ] 5. 汇报版本与 CHANGELOG 摘要
```

### 1. 分析变更

```bash
git show <sha> --stat --format=fuller
git show <sha> -p          # 需要 API/类型细节时
git diff <base>...HEAD     # 多 commit 合并发版时
```

按**文件路径**映射到包（见下表）。changeset 按用户影响归类（Added / Fixed / Changed），不按 commit 逐条罗列。

### 2. 路径 → 包名

| 目录 | frontmatter 包名 |
|------|------------------|
| `packages/d-render/` | `d-render` |
| `packages/shared/` | `@d-render/shared` |
| `packages/design/` | `@d-render/design` |
| `packages/plugin-standard/core/` | `@d-render/plugin-standard` |
| `packages/plugin-standard/configure/` | `@d-render/plugin-standard-configure` |
| `packages/plugin-standard/mobile/` | `@d-render/plugin-standard-mobile` |

**不写 changeset**：`docs/`（`d-render-docs`）、`play/`、根目录构建/CI（不改变包产物）。

### 3. bump 级别

| 变更 | bump |
|------|------|
| 新 API / prop / 组件 / 导出 | `minor` |
| bug 修复、样式、非破坏性类型收紧 | `patch` |
| 破坏性 API、配置迁移、改引入方式 | `major` |

只为**实际改动**的包写 frontmatter。`baseBranch` 为 `v7.x`（`.changeset/config.json`）。

### 4. 编写 changeset

路径：`.changeset/<语义化名称>.md`

```markdown
---
"d-render": patch
---

### Fixed
- **DrSearchForm**：修复 `changeValue` 在存在 `defaultModel` 时不生效的问题。
```

正文规则（摘要）：

- 语言：**简体中文**
- 组件用 **Dr 前缀**（`DrTable`、`DrSearchForm`；源码 `cip-*` 等价）
- shared 写 hook/函数/类型名（`useFormInput`、`ITableRenderConfig`）
- 每条写清做了什么、默认值、是否破坏性、升级注意

### 5. 执行 gen:version

创建 changeset 后，**同一轮对话内**在仓库根目录执行：

```bash
pnpm gen:version
```

- 退出码须为 0
- 确认相关包 `CHANGELOG.md` 与 `package.json` 版本已更新
- changeset 文件被消费删除属正常
- **不要**替用户 `git commit` / `git push`，除非明确要求

### 6. 汇报

向用户说明：

- 哪些包 bump 到什么版本
- CHANGELOG 新增摘要
- 仍存在的未提交文件

## 何时跳过 gen:version

- 仅查看/解释已有 CHANGELOG，且未新建 changeset
- 用户明确说「先不要发版 / 不要 gen:version」
- `.changeset/` 无待消费 `.md`（除 `README.md`）

## 跨包联动

- `d-render` ← `@d-render/shared`：shared 类型/hook 变更常联动 bump `d-render`
- `@d-render/design` 依赖 `d-render` + shared：仅 UI 改 design；依赖新渲染 API 时同步 bump `d-render`
- `plugin-standard*`：核心渲染变更时注明最低兼容版本

## 失败处理

`pnpm gen:version` 失败时：根据终端输出修复（包名、frontmatter 格式）后重试，直至成功或说明阻塞原因。

## 构建验证（可选）

- `pnpm build:shared` / `pnpm build:d-render` / `pnpm build:design`
- `pnpm build:plugin-standard:core` / `pnpm build:plugin-standard:configure`
- `pnpm build-all`

## 更多参考

- 完整规范与示例：[reference.md](reference.md)
- 仓库 Cursor 规则：`.cursor/rules/changeset-changelog.mdc`
