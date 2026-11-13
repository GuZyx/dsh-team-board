# 发布手册 · Publishing

这份文件说明怎么把这个插件发出去让别人装。**发布动作需要你自己的账号或公开仓库**，代码侧已经准备好。

## 先决定：走哪条渠道

| 渠道 | 需要什么 | 别人怎么装 | 后续升级 |
| --- | --- | --- | --- |
| npm 公开包 | npm 账号 + `npm publish` | 市场索引指向 npm 版本 | 装新版本即可 |
| Git 固定 commit | 一个公开 Git 仓（GitHub/GitLab） | 市场索引指向 commit | 索引换新 commit |
| 官方离线目录 | 由 DeepSeek 随安装包维护 | Discover 直接显示 | 官方是否收录不由我们决定 |

**官方离线目录不是自助的**：`listBundles` 把随安装包提供的条目标记为 `official`，第三方无法通过配置文件塞进去。想让插件出现在官方目录里，只能走官方收录渠道（提交给 DeepSeek）。

## 第 0 步：包名

当前包名 **`dsh-team-board`** —— Git 渠道可以直接装，也不会与别人 profile 里的 `@local/*` 撞名。npm 上同名若已被占用，再改成 `@your-scope/dsh-team-board`。

**改包名时三个地方必须同步**，否则客户端模块 id 与加载器入口对不上，插件不激活：

1. `package.json` → `name`
2. `client.js` 第 3 行附近 → `window.__ModuleLoader__.load({ id: '<包名>', ... })`
3. `cordis.patch.yml` → 行里的 `name: '<包名>'`

另外把 `package.json` 里的 `homepage` / `repository` / `bugs` 换成真实地址。

## 第 1 步：自检

```sh
# 结构与语法
node -e 'new Function(require("fs").readFileSync("client.js","utf8")); console.log("client ok")'
node -e 'JSON.parse(require("fs").readFileSync("package.json","utf8")); console.log("manifest ok")'

# 打包内容（确认没有漏文件）
npm pack --dry-run
```

`files` 必须覆盖 `index.js`、`client.js`、`cordis.patch.yml`、`locale/*.json`、`docs`、`icon.svg`、`README.md`、`LICENSE`。

## 第 2 步：发布

### npm

```sh
npm adduser                 # 或 npm login
npm publish --access public
```

### Git

本地仓已经初始化并有一版提交（`.gitignore` 已排除 `node_modules/`、`*.tgz`、`.DS_Store`）。剩下：

```sh
# 1) 在 GitHub / GitLab 上建一个「公开」空仓（不要勾 README/license）
# 2) 关联并推送
git remote add origin git@github.com:<you>/<repo>.git
git branch -M main
git push -u origin main

# 3) 取完整 commit SHA（40 位小写十六进制）
git rev-parse HEAD
```

推送后把这个 SHA 填进索引的 `source.commit`。**索引只认完整 40 位小写 SHA**；`abc1234` 这种短 SHA 会被校验器拒绝。

## 第 3 步：写索引文件

索引文件就是仓库根目录的 [market-index.json](market-index.json)，**不需要另找托管**——直接用它的 raw 地址：

```
https://raw.githubusercontent.com/GuZyx/dsh-team-board/main/market-index.json
```

`icon.svg` 相对索引 URL 解析，正好指向同目录的图标。注意 raw 必须配**最终地址**，`pluginMarket` 拒绝重定向。

格式已用官方校验器 `@deepseek-ai/dsh-plugin-market-index` 验证过；改完再跑一次：

```sh
node -e '
const { parseMarketIndex } = require("<harness>/node_modules/@deepseek-ai/dsh-plugin-market-index");
const doc = JSON.parse(require("fs").readFileSync("market-index.json","utf8"));
parseMarketIndex(doc, "https://example.com/index.json");
console.log("index ok");
'
```

### 版本字段含义

- `source.type: "npm"` —— 从 npm 装该版本；`registry` 可选（默认公共 npm）
- `source.type: "git"` —— 需要 `url` + `commit`（**完整 40 位小写十六进制**），可选 `path`：包在仓库子目录时写相对目录（如 `packages/kanban`，不能以 `/` 开头）；包在仓库根目录时**不要写 `path`**
- `publishTimestamp` —— Unix 秒，整数
- `engines.dsh` —— 兼容区间；市场用它决定"能不能装"，**这一项别写宽松了**

安装参数由 `marketInstallTarget()` 生成，Git 版本是 `git+<url>#<commit>`（带 path 时追加 `&path:/<path>`）。

## 第 4 步：让别人装

对方在 **Plugins → Discover → 添加索引** 填入你的索引 URL，就能看到条目并安装。也可以直接把 `name@version` 或 `git+...#commit&path:/` 给对方，用 `Add plugin` 装。

## 第 5 步：升级

1. 改 `package.json` 版本号
2. 重新 `npm publish`（或 push 新 commit）
3. 索引里加一个新 `versions[]` 条目（保留旧版本，用户可回退）
4. 用户侧刷新索引即可看到更新

## 已知的长期风险

插件读的是 Harness **Client 侧服务方法**（`ctx.sessions.refreshProjections` / `refresh` / `list`、`ctx.uiWorkspace.mainReference`），不是带版本承诺的公开契约。`engines.dsh` 已经把范围收窄到 `>=0.2.2-rc.2 <0.3.0`，但：

- DSH 升到 0.3 前，需要在新版本上重新跑一遍看板并更新区间
- 想长期稳定，最干净的做法是推动上游暴露一个稳定的 `agentTeam` 读取接口（Host 投影或 Client 服务），插件不再碰内部字段
