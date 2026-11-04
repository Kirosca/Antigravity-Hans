# 普通版 2.29.0 本地更新

本次更新针对 Antigravity 普通版 2.29.0；IDE 静态补丁、语言配置及专属词条保持兼容。

词库扩充至 **2750 条**。所有新增文案均对照本机 2.29.0 实际运行加载的前端 `main.js`（10.67 MB，SHA-256: `8D1196A22CD3EB9779E8FAF5C31EB732D3DF8D9D037B685733ED4E3D6CDFB5A2`）及核心底层服务。

---

### 覆盖与适配领域

1. **支线提问与旁支对话 (Side Question)**
   - 适配支线提问全套控制：`Side Question` → `支线提问`、`Ask a side question without interrupting the main conversation` → `在不中断主对话的情况下进行支线提问`。
   - 支线状态与提升限制：`Stop Side Question` → `停止支线提问`、`Cannot promote while side question is running` → `支线提问运行期间无法提升为主对话`。

2. **计划任务与自动化 (Automations & Schedules)**
   - 计划创建与类型配置：`Add schedule` → `添加计划`、`Change schedule` → `修改计划`、`Custom schedule` → `自定义计划`、`Schedule type` → `计划类型`、`Day of the month` → `每月几号`、`Day of the week` → `每周星期几`。
   - 任务目标与触发条件：`When should it run?` → `应该在何时运行？`、`Where should it run?` → `应该在哪里运行？`、`What should it do?` → `应该执行什么操作？`、`What should the agent do on each run?` → `智能体每次运行应执行什么操作？`、`When something happens` → `当特定事件发生时`、`Creates a local automation that runs on this computer` → `创建在此电脑上运行的本地自动化`。
   - 账户依赖与运行记录：`Connect an account so the agent can run automations.` → `连接账户以便智能体运行自动化任务。`、`All runs` → `所有运行记录`、`Workflow runs` → `工作流运行记录`。

3. **连接器与外部代码托管 (Connectors & GitHub)**
   - 连接器发现与浏览：`Connectors` → `连接器`、`Browse Connectors` → `浏览连接器`、`Search connectors` → `搜索连接器`、`Browse MCP resources` → `浏览 MCP 资源`、`Browse rules` → `浏览规则`。
   - GitHub 终端认证：`Connect GitHub` → `连接 GitHub`、`Connect GitHub with the GitHub plugin` → `通过 GitHub 插件连接 GitHub`、`Connect GitHub: Run gh auth login in a terminal` → `连接 GitHub：在终端中运行 gh auth login`、`Copy gh auth login command` → `复制 gh auth login 命令`、`Authentication required for this GitHub host.` → `此 GitHub 主机需要身份认证。`。

4. **语音模式增强与 Gemini Live 音色库 (Voice Mode & Gemini Live)**
   - 语音状态与音色说明：`Start Voice mode` → `启动语音模式`、`Voice mode in progress` → `语音模式进行中`、`Voice transcript` → `语音转写记录`、`The voice used in Voice mode. Powered by Gemini Live.` → `语音模式所用音色。由 Gemini Live 提供支持。`。
   - 麦克风与语速控制：`Switch mic` → `切换麦克风`、`Using system default microphone` → `正在使用系统默认麦克风`、`Voice speed` → `语速`、`Voice preview failed to play:` → `语音试听播放失败：`。
   - 新增音色与风格描述：`Arlo` → `阿洛 (Arlo)`、`Cleo` → `克莱奥 (Cleo)`、`Tari` → `塔里 (Tari)`、`Clear and friendly` → `清晰亲切`、`Confident and clear` → `自信清晰`、`Deep and velvety` → `深沉醇厚`、`Warm and approachable` → `温暖亲和`、`Warm and engaging` → `热忱动人`。

5. **内置浏览器安全防护与下载管理 (Browser Security & Downloads)**
   - 安全连接与证书警告：`This site cannot provide a secure connection.` → `此网站无法提供安全连接。`、`This site uses an unsupported TLS protocol or cipher suite.` → `此网站使用了不受支持的 TLS 协议或密码套件。`、`Certificate is not valid` → `证书无效`、`Your connection to this site is not fully secure` → `您与此网站的连接未完全加密`、`This link wants to open an app on your device.` → `此链接请求打开您设备上的应用程序。`。
   - 隐私与历史清除：`Browsing History` → `浏览历史`、`Clear visited URLs and autocomplete suggestions from the built-in browser.` → `清除内置浏览器中访问过的 URL 与自动补全建议。`、`Clear visited URLs and autocomplete suggestions from side panel preview.` → `清除侧边栏预览中访问过的 URL 与自动补全建议。`。
   - 下载列表管理：`Downloads` → `下载`、`Download Location` → `下载保存位置`、`Cancel download` → `取消下载`、`Close downloads` → `关闭下载列表`、`Show in folder` → `在文件夹中显示`。

6. **面板布局、终端与交互设置 (Panels & Interaction)**
   - 面板切换：`Bottom Panel` → `底部面板`、`Terminal Placement` → `终端位置`、`Toggle Side Panel` → `切换侧边栏面板`、`Toggle Maximize Side Panel` → `切换最大化侧边栏面板`、`Toggle Terminal Panel` → `切换终端面板`、`Close Tabs to the Left` → `关闭左侧标签页`。
   - 输入与指示器：`Chat Input` → `对话输入框`、`Chat Width` → `对话区域宽度`、`Send messages with the keyboard's Enter key instead of starting a new line.` → `使用键盘 Enter 键直接发送消息，而非换行。`、`Show how full the context window is next to the send button. Click it for a breakdown and to see your model quota.` → `在发送按钮旁显示上下文窗口占用比例。点击可查看明细及模型配额。`、`Context and Quota Indicator` → `上下文与配额指示器`。

---

### 验证与质量门禁

- **词库体检**：`tools/lint-overlay.mjs` 全量通过，2750 条词条 0 错误、0 警告。
- **单元测试**：`tools/overlay.test.mjs` 包含 2.23 ~ 2.29.0 版本回归测试在内的 15 项测试全部通过（15/15 pass）。
