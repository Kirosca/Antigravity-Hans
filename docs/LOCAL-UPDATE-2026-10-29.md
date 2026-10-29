# 普通版 2.28.0 本地更新

本次更新针对 Antigravity 普通版 2.28.0；IDE 静态补丁、语言配置及专属词条保持兼容。

词库从 2015 条大幅扩充至 **2472 条**（新增 457 条核心词条）。所有新增文案均对照本机 2.28.0 实际运行加载的前端 `main.js`（10.15 MB，SHA-256: `4D2D2F3AB5AAAEDA254EC4B773593FC5DB683F0B5DDF81225C65A5F60E644038`）及核心底层服务。

---

### 覆盖与适配领域

1. **辅助面板与工作区布局 (Auxiliary Pane & Layout)**
   - 适配辅助面板控制：`Toggle Maximize Auxiliary Pane` → `切换最大化辅助面板`、`Restore Pane` → `还原面板`、`Close Panel` → `关闭面板`。
   - 补齐工作区新视图与侧边栏：`Sidecar View` → `Sidecar 视图`、`Open in Side Panel` → `在侧边面板中打开`、`Side Panel Preview` → `侧边面板预览`、`Virtual File Viewer` → `虚拟文件查看器`、`Artifact Viewer` → `产物查看器`、`Directory Viewer` → `目录查看器`。
   - 对话与标签操作：`Open Conversation in New Tab` → `在新标签页打开对话`、`Move Conversation Up` → `上移对话`、`Move Conversation Down` → `下移对话`、`Reopen Closed Tab` → `重新打开关闭的标签页`。

2. **全局快捷键设置与管理 (Keyboard Shortcuts)**
   - 适配快捷键编辑与录制对话框：`Edit Shortcut` → `编辑快捷键`、`Add Shortcut` → `添加快捷键`、`Remove Shortcut` → `移除快捷键`、`Press keys...` → `请按下快捷键…`、`Stop Editing` → `停止编辑`。
   - 快捷键重置与搜索：`Reset all shortcuts to defaults` → `将所有快捷键重置为默认值`、`No keyboard shortcuts found matching your filter.` → `未找到匹配当前筛选条件的快捷键。`。

3. **实验性 Flag 调试与功能环境模拟 (Flags & Environment Overrides)**
   - 适配开发者 Flag 搜索与启用：`Search flags` → `搜索 Flag 标志`、`No matching flags` → `没有匹配的 Flag 标志`、`Print telemetry to the console` → `在控制台输出遥测信息`、`Turn on a flag you don't have` → `开启未拥有的实验性 Flag`、`Custom Flags` → `自定义 Flag`。
   - 补齐功能准入与环境覆盖模拟：`Override feature environment` → `覆盖功能环境`、`Simulate running on a different OS.` → `模拟在不同的操作系统上运行。`、`Simulate a different host...` → `模拟不同的宿主环境（Electron、桌面或移动 Web、扩展、远程控制或已安装的 PWA）。`、`Simulate a different user cohort...` → `模拟不同的用户群体（Google 内部、外部用户、企业用户）。`。

4. **实时语音与音效引擎 (Live Chat & Voice Relay)**
   - 适配实时语音操作：`Start Live Chat` → `开始实时语音通话`、`End Live chat` → `结束实时语音通话`、`Mute Live Chat Mic` → `静音实时语音麦克风`、`Unmute mic` → `取消麦克风静音`、`Mute mic` → `麦克风静音`。
   - 适配语音服务引擎：`Talker + Narrator (relay)` → `对话者 + 旁白 (中继)`、`A fast Talker acks; Jetski answers; a Narrator reads it out.` → `快速对话者确认响应；Jetski 提供回答；旁白将其朗读出来。`。

5. **内置浏览器安全、证书与网络 (Built-in Browser & Security)**
   - 适配内置浏览器导航与状态：`Opening page` → `正在打开页面`、`Going back` → `后退`、`Going forward` → `前进`、`Reloading page` → `重新加载页面`、`Pressing key` → `按键`、`Scrolling down` → `向下滚动`、`Switching tabs` → `切换标签页`。
   - 证书查看器与连接安全：`Connection is secure` → `连接是安全的`、`The certificate has expired or is not yet valid.` → `证书已过期或尚未生效。`、`The certificate is not issued by a trusted authority.` → `证书并非由受信任的颁发机构签发。`、`Certificate details` → `证书详情`、`Issued to` → `颁发给`、`Issued by` → `颁发者`、`Valid until` → `有效期至`。
   - 站点允许列表与安全限制：`Denied Sites` → `已拒绝的站点`、`Site Allowlist` → `站点允许列表`、`Add them to allow future interactions` → `将其添加以允许后续交互`。

6. **智能体浏览器动作自动化 (Browser Agent Actions)**
   - 补齐智能体操控浏览器的状态提示：`Simulating Key Press in Browser` → `在浏览器中模拟按键`、`Moving Mouse in Browser` → `在浏览器中移动鼠标`、`Typing into Browser` → `正在输入到浏览器`、`Scrolling in Browser` → `正在浏览器中滚动`、`Resizing Browser window` → `正在调整浏览器窗口大小`、`Taking Screenshot` → `正在截取屏幕截图`、`Clicking in Browser` → `正在浏览器中点击`、`Dragging in Browser` → `正在浏览器中拖拽`、`Reading Browser Page in Browser` → `正在浏览器中读取网页`、`Extracting DOM elements` → `正在提取 DOM 元素`、`Fetching network requests` → `正在获取网络请求` 等。

7. **插件扩展、MCP 应用与 Hook 体系 (Plugins, MCP Apps & Hooks)**
   - 适配 MCP App 接入与生命周期：`MCP App` → `MCP 应用`、`MCP Servers Disabled` → `MCP 服务器已禁用`、`Refresh MCP servers` → `刷新 MCP 服务器`。
   - 适配执行 Hook 触发机制：`Hook will trigger if any tool is executed.` → `执行任意工具时均会触发 Hook。`、`Fires before a tool step executes.` → `在工具步骤执行前触发。`、`Fires after a tool step completes.` → `在工具步骤完成后触发。`、`Add Hook Card` → `添加 Hook 卡片`。

8. **智能体交互与问答审核 (Human-in-the-Loop & Elicitation)**
   - 适配终端与 URL 授权提示：`Requesting your permission in Terminal:` → `在终端中请求您的权限:`、`Requesting your permission to open URL:` → `请求打开 URL 的权限:`、`The agent has questions for you:` → `智能体有若干问题需要您回答:`、`Click to respond to the questions.` → `点击以回答这些问题。`。
   - 补齐问卷与等待状态：`Cancel Questionnaire and Stop the Agent` → `取消问卷并停止智能体`、`Waiting for your input` → `等待您的输入`、`Send command input?` → `是否发送命令输入？`。

9. **差异对比与历史撤销管理 (Diffs & Reverts)**
   - 适配工作区快照还原与限制提示：`Undo restores your entire workspace to its state at this point.` → `撤销将使您的整个工作区恢复到此时的状态。`、`Confirming this undo action will make the following changes:` → `确认此撤销操作将进行以下更改:`、`Cannot revert this message` → `无法还原此消息`、`Cannot revert messages before or at the point where Best of N mode was triggered` → `无法还原触发 Best of N 模式之前或节点处的消息`。

10. **智能体工具执行与错误反馈 (Tool Executions & Error Handling)**
    - 补齐工具报错与详细堆栈：`Error while editing` → `编辑时出错`、`Error while searching filesystem` → `搜索文件系统时出错`、`Error while running command` → `运行命令时出错`、`Error while semantic searching` → `语义搜索时出错`、`Agent encountered an internal error.` → `智能体遇到了内部错误。`、`Full output written to` → `完整输出已写入至`。

---

### 验证与质量门禁

- **词库体检**：`tools/lint-overlay.mjs` 全量通过，2472 条词条 0 错误、0 警告。
- **单元测试**：`tools/overlay.test.mjs` 包含 2.23、2.25、2.26、2.27 及 2.28 专属回归测试在内的 12 项测试全部通过（12/12 pass）。
