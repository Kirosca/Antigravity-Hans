# 普通版 2.25.0 本地更新

本次针对 Antigravity 普通版 2.25.0；IDE 静态补丁、语言配置及专属词条保持兼容。

词库从 1300 条增加到 1500 条。新增的普通版控件与设置文案，逐条对照本机 2.25.0 实际运行加载的前端 `main.js` 以及安装包核心模块（`menu.js`、`ipcHandlers.js`、`updater.js`、`wsl.js`）。前端资源 SHA-256：

```
91c2d259d53a16b0cb9afe87e5d9f173ba613a46a076032a179ac5eca5101463
```

### 覆盖与适配领域

1. **轨迹与调试视图 (Trajectory & Debug View)**
   - 补齐调试视图入口文案：`Open Trajectory Debug View` → `打开轨迹调试视图`、`Copy Trajectory ID` → `复制轨迹 ID`。
   - 适配轨迹加载中状态：`Loading trajectory...` → `正在加载轨迹…`。

2. **多工作区类型与工作树管理 (Workspaces & Worktree)**
   - 新增 Piper (g4)、JJ、Cog (GoB)、Fig 以及 ABFS Alpha 提示词初始化及创建工作区说明文案。
   - 补齐 CitC 工作区引导、独立工作区分组提示及工作树删除状态反馈。

3. **定时与自动化调度任务 (Automations & Schedules)**
   - 适配自动化任务创建、编辑与调度周期文案：`Prompt to execute on schedule...`、`Uses your local files and tools. Schedules only.`。
   - 补齐自动化凭据刷新状态：`Refreshed credentials for all automations.`、`Refresh all credentials` 等。

4. **智能体脚本与 Sidecar 配置 (Agent Scripts & Sidecars)**
   - 适配全局 `~/.gemini/antigravity/agents/` 与项目工作区 `.agent/agents/` 脚本存储指引。
   - 补齐智能体脚本命令配置对话框、参数验证提示及 Sidecar 支持状态。

5. **插件与 MCP 扩展体系 (Plugins & MCP Extensions)**
   - 新增插件市场与一键安装引导：`Find plugins - bundles of skills, agents, MCP servers, UI extensions and more...`。
   - 补齐 MCP 服务器配置表单必填验证、权限审核与保存流程文案。

6. **评论与产物审核 (Comments & Reviews)**
   - 补齐产物评论、文件差异评论与代码行评论界面：`Artifact Comments`、`File Diff Comments`、`Leave a comment`、`1 Comment` 等。
   - 适配审核状态标签：`In review` → `审核中`、`Requested changes` → `已请求更改`。

7. **网页预览与内嵌策略 (Web Previews & Embedding)**
   - 适配 X-Frame-Options 与 CSP 限制下的加载超时提示与后备跳转操作。

8. **媒体操作、导出与云端硬盘上传 (Media, Export & Drive)**
   - 适配视频/图片保存与下载文案、PDF/产物导出、Google 云端硬盘上传及状态反馈。

9. **更新与通用交互 (Updates & General UI)**
   - 补齐菜单与弹窗中的更新操作文案（下载更新、正在安装更新、重启以更新等）。
   - 补齐按对话独立配置遥测、文件资源管理器、代码块展开与常用快捷操作。

10. **设置与弹窗渲染平滑度优化 (Smooth Ready)**
    - 针对设置面板与抽屉弹窗打开时出现的英文闪烁跳变问题（FOUC），引入 `antigravity-zh-smooth-style` 平滑渲染遮罩与同步预处理机制。在弹窗挂载时优先同步翻译其子树节点并标记 `data-zh-ready="true"` 瞬时淡入，彻底消除视觉跳字。

### 验证与质量门禁

- 通过 `tools/lint-overlay.mjs` 词典体检，1500 条词条全数通过，0 错误、0 警告。
- 通过 `tools/overlay.test.mjs` 原生测试，包括指纹更新、观察器替换、权限目标保护、2.23 与 2.25 版本控件回归、平滑渲染等共 9 项测试。
