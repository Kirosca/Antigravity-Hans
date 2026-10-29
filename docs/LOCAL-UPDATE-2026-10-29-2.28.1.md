# 普通版 2.28.1 本地更新

本次更新针对 Antigravity 普通版 2.28.1；IDE 静态补丁、语言配置及专属词条保持兼容。

词库扩充至 **2496 条**。所有新增文案均对照本机 2.28.1 实际运行加载的前端 `main.js`（10.16 MB，SHA-256: `ED358594A9ADCD0B129EB5B0C202CB3BFFF67FE4523C62B26EB204B94461CF82`）及核心底层服务。

---

### 覆盖与适配领域

1. **插件市场第三方免责声明与元数据 (Marketplace Notice & Metadata)**
   - 适配免责声明与元数据：`Marketplace notice` → `插件市场声明`、`Plugin metadata` → `插件元数据`。
   - 补齐插件搜索与空状态：`No plugins match your search.` → `没有找到符合您搜索的插件。`、`No plugins available in the marketplace.` → `市场中暂无可用插件。`。
   - 适配 Flag 异常诊断：`Malformed third party tools disclaimer flag` → `第三方工具免责声明 Flag 格式错误`。

2. **系统路径与高频交互控制 (System & General UI)**
   - 补齐高频系统与工作区控件：`This Computer` → `此电脑`、`Background Commands` → `后台命令`、`Auto (detected)` → `自动 (已检测)`、`Render failed` → `渲染失败`、`projectManagementService is not available` → `项目管理服务不可用`。
   - 基础操作词条：`Cut` → `剪切`、`Paste` → `粘贴`、`Select` → `选择`、`Forward` → `前进`、`Voice` → `语音`、`Fork` → `创建分支`、`Goals` → `目标`、`Links` → `链接`、`Files` → `文件`、`Documents` → `文档`、`Uploads` → `上传`、`Extensions` → `扩展`、`Combobox` → `组合框`、`Cloud` → `云端`。

---

### 验证与质量门禁

- **词库体检**：`tools/lint-overlay.mjs` 全量通过，2496 条词条 0 错误、0 警告。
- **单元测试**：`tools/overlay.test.mjs` 包含 2.23 ~ 2.28.1 版本回归测试在内的 13 项测试全部通过（13/13 pass）。
