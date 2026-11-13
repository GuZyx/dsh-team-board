# 协作任务板 · Team task board

DeepSeek Harness 的左侧栏看板页面，把 **Agent Teams 的共享任务**和**子智能体成员**放到一个能长期盯着的页面上：三列看板、依赖箭头、写域冲突提示、搜索过滤、键盘操作、多会话总览。

> A left-sidebar kanban page for DeepSeek Harness: Agent Teams shared tasks plus subagent members, with dependency arrows, write-scope warnings, search, keyboard control and a cross-session overview.

## 它补的是什么

Harness 自带的任务板在会话头部弹出层里，只读、只显示任务、且一次只看一个根会话。这个页面把同一份投影数据摊开成一个整页：

- **子智能体**：标题、agent 名、累计 token、耗时；运行中每秒走时
- **三列看板**：待处理 / 进行中 / 已完成
- **依赖箭头**：`blockedBy` 连线并标注方向
- **写域冲突**：`writeScopeWarnings` 非空时卡片描边 + 冲突文本
- **全部会话**：按会话分组汇总，点「打开」回到单板

数据全部来自 Harness 已有的会话投影（`agentTeam`、`subagentCatalog`、`tokenUsage`、`subagentTiming`）。**本插件没有 Host 侧逻辑，不改投影，不新增 Remote 命名空间。**

## 安装

### 从插件市场

在 Harness 的 **Plugins → Discover** 里添加本插件的索引 URL，然后安装。索引是一个 JSON 文件，格式见 [market-index.example.json](market-index.example.json)。

### 从本地目录

**Plugins → Add plugin**，选择本包目录；或由 agent 执行 `plugin_manager` 的 `install_bundle`，`target` 指向目录绝对路径。

### 从 npm / Git

```sh
# npm
dsh plugin install <package-name>@<version>
# Git（固定 commit）
dsh plugin install "git+https://github.com/<you>/<repo>.git#<commit>&path:/"
```

安装后**重启 Harness**：客户端插件按模块代加载，刷新页面不一定换到新的一代。

## 用法

左侧栏 → **协作任务板**（排在「自动化任务」下面）。

- 顶部下拉：**全部会话** / **跟随当前会话** / 钉住某个会话（每项带任务计数）
- 工具栏：搜索任务/负责人/写域，「只看被依赖阻塞」「只看写域冲突」，按负责人筛选
- 点卡片展开完整描述、写域路径、冲突原因、被谁阻塞；点依赖项跳到那张卡
- 点负责人名字 = 只看该负责人
- 自动刷新：关 / 10 秒 / 30 秒

视图、搜索词、过滤条件、自动刷新间隔记在 `localStorage` 的 `dsh.team-kanban.v1`。

### 键盘

| 键 | 作用 |
| --- | --- |
| `↓` / `j` | 下一张卡 |
| `↑` / `k` | 上一张卡 |
| `Enter` / `Space` | 展开/收起 |
| `Esc` | 收起并清除光标 |
| `/` | 聚焦搜索 |
| `g` | 在跟随/总览之间切换 |
| `r` | 刷新 |

## 兼容性

- 声明 `engines.dsh: >=0.2.2-rc.2 <0.3.0`。装在区间外的 DSH 上，插件市场与安装器会拒绝，而不是装上一个可能崩的包。
- 依赖 Harness Client 侧的几个服务方法（`ctx.sessions.refreshProjections` / `refresh` / `list`、`ctx.uiWorkspace.mainReference`）。这些不是带版本承诺的公开契约，**升级到 0.3 前需要重新验证**。所有读取都做了 try/catch 与降级，失败时显示提示文案而不是把面板打白。
- 只读：不提供任何任务写操作。认领、完成、改依赖必须由 agent 通过 `team_task_*` 工具完成，因为任务变更要走 CAS 和会话日志。

## 限制

- 子会话没有自己的板子，切到子会话任务区为空；子智能体区会向上找到根会话的目录。
- 成员行不能打开子会话，只展开 token 明细与会话 id。
- 全部会话总览不画箭头（跨会话依赖没有意义）；只聚合已加载的会话。
- 面板文案目前只有中英两种。

## 许可

MIT
