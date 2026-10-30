# 普通版 2.28.2 本地更新

本次更新针对 Antigravity 普通版 2.28.2；IDE 静态补丁、语言配置及专属词条保持兼容。

词库扩充至 **2608 条**。所有新增文案均对照本机 2.28.2 实际运行加载的前端 `main.js`（10.16 MB，SHA-256: `C3C5C9BB6D418E8D919CB94AA7DE4DF9BA449056B7D6122C32279CE72E2D2BAD`）及核心底层服务。

---

### 覆盖与适配领域

1. **账户与认证管理 (Accounts & Authentication)**
   - 适配账户状态与标签：`Accounts` → `账户`、`Accounts tab` → `账户标签页`、`Action required` → `需要操作`。
   - 适配认证与登录指引：`Authentication Required` → `需要身份认证`、`Authentication expired` → `身份认证已过期`、`Sign in needed` → `需要登录`、`Sign in required` → `要求登录`、`Sign in with a different account` → `使用其他账户登录`、`Your session has expired. Please log back in to continue.` → `您的会话已过期，请重新登录以继续。`。
   - 第三方与连通性账户：`Continue with Google` → `使用 Google 账号继续`、`Connect an account so the agent can use this app.` → `连接账户以便智能体使用此应用。`、`Apps connected to your account` → `已连接至您账户的应用`。

2. **插件市场与技能探索 (Marketplace & Customizations)**
   - 市场搜索与发现：`Agent Market Search Results` → `智能体市场搜索结果`、`Searching Agent Market...` → `正在搜索智能体市场...`、`Explore other marketplace customizations` → `探索更多市场自定义项`、`Explore the plugin marketplace` → `探索插件市场`、`Search and discover customizations to extend your Agent's capabilities.` → `搜索并探索自定义项以扩展您的智能体能力。`。
   - 技能与插件运行控制：`Create a Plugin with the Agent` → `使用智能体创建插件`、`Each plugin can be managed on its own.` → `每个插件均可单独进行管理。`、`Enable the plugin to sign in.` → `启用插件以进行登录。`、`Encountered an error while running the plugin.` → `运行插件时遇到错误。`、`This bundle has no plugins yet.` → `此捆绑包中暂无插件。`、`This skill came from the marketplace, so you can add it again whenever you need it.` → `此技能来自市场，您可随时按需重新添加。`。

3. **工作区与项目管理 (Workspace & Project Management)**
   - 工作区操作：`Archive Workspace` → `归档工作区`、`Delete workspace` → `删除工作区`、`Unmount workspace` → `卸载工作区`、`Clone current workspace into a new independent workspace` → `将当前工作区克隆为全新的独立工作区`、`Show temporary and forked workspaces` → `显示临时与分支工作区`。
   - 项目与云端挂载：`A project with this name already exists.` → `已存在同名项目。`、`Could not create project` → `无法创建项目`、`Cloud Projects` → `云端项目`、`Uploaded files and connected resources are mounted in your cloud environment.` → `已上传的文件与连接的资源已挂载到您的云端环境中。`。

4. **会话、交互与设置 (Conversation, Interaction & Settings)**
   - 会话记录与工件评论：`Conversation ID` → `对话 ID`、`Copy Message` → `复制消息`、`Artifact updated by agent` → `工件已由智能体更新`、`Select text in the artifact to add a comment` → `在工件中选择文本以添加评论`、`Drag to select a region to comment` → `拖拽框选区域以添加评论`。
   - 录制与调试：`Screen Recording` → `屏幕录制`、`Stop Recording` → `停止录制`、`Trajectory Debug View` → `轨迹调试视图`。
   - 设置与字体主题：`Use Google Sans instead of the default Inter typeface` → `使用 Google Sans 字体替代默认的 Inter 字体`、`Use the experimental visual themes instead of standard presets` → `使用实验性视觉主题替代标准预设主题`、`Telemetry is disabled in Settings` → `遥测已在设置中禁用`。

---

### 验证与质量门禁

- **词库体检**：`tools/lint-overlay.mjs` 全量通过，2608 条词条 0 错误、0 警告。
- **单元测试**：`tools/overlay.test.mjs` 包含 2.23 ~ 2.28.2 版本回归测试在内的 14 项测试全部通过（14/14 pass）。
