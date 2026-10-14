# Antigravity 汉化工具 (Antigravity-Hans)

专为 **Google Antigravity** 及 **Antigravity IDE** 开发的中文汉化工具。

> **适配版本**：**Antigravity `2.23.0`** 与 **Antigravity IDE `2.5.5`**。
>
> 本轮更新针对普通版 `2.23.0`，词库扩充至 1300 条经过实际前端资源核对的词条；IDE 的静态补丁与语言配置未调整。动态汉化基于 CDP 注入，界面文案或 DOM 结构变化时仍可能需要更新词库；静态补丁与 IDE 内部目录结构强相关。

---

## 效果预览

<img width="2560" height="1600" alt="Antigravity 汉化预览 1" src="https://github.com/user-attachments/assets/4afcc033-34e4-47f7-bca1-53c341780b36" />
<img width="2560" height="1600" alt="Antigravity 汉化预览 2" src="https://github.com/user-attachments/assets/db2173c3-6c92-493c-bcb0-d3235133a381" />

---

## 快速使用

前往 [Releases](../../releases) 下载对应平台的单文件即可运行：

- **Windows**：双击 `antigravity-hans-windows-amd64.exe`，在交互菜单中选择对应模式。
- **macOS**：
  ```bash
  chmod +x antigravity-hans-macos-*
  ./antigravity-hans-macos-arm64  # Apple Silicon
  ./antigravity-hans-macos-amd64  # Intel
  ```

```text
Antigravity-Hans 启动器
----------------------------------------
1. 启动 Antigravity (动态汉化)
2. 启动 Antigravity IDE (动态汉化)
3. 静态补丁管理 (仅支持 IDE)
4. 生成桌面快捷启动方式
0. 退出
----------------------------------------
```

> **提示**：首次使用 IDE 时，工具会自动检测并提示安装[官方中文语言包 (Chinese (Simplified) Language Pack)](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)，确保菜单栏与底层编辑器完整汉化。

---

## 命令行参数

```bash
# 直接启动汉化
antigravity-hans --app         # 动态汉化 Antigravity
antigravity-hans --ide         # 动态汉化 Antigravity IDE
antigravity-hans --patch       # 静态补丁管理 (仅支持 IDE)

# 生成一键汉化快捷方式
antigravity-hans --shortcut        # 为两者生成快捷方式
antigravity-hans --shortcut --app  # 仅 Antigravity
antigravity-hans --shortcut --ide  # 仅 Antigravity IDE

# 维护
antigravity-hans --stop                    # 结束由本工具启动的汉化监视器
antigravity-hans --trust-external-overlay  # 显式信任同目录外部汉化脚本（类型与大小限制仍生效）
```

---

## 汉化模式

1. **动态汉化（推荐）**：
   - 支持 Antigravity 及 Antigravity IDE。
   - 通过 CDP 动态翻译界面，保留应用安装资源；注入状态随应用页面关闭而消失。
   - 可通过 `--shortcut` 参数一键生成桌面快捷方式，日常双击即可自动启动汉化。
2. **静态补丁（仅支持 Antigravity IDE）**：
   - 直接修改本地 IDE 安装包资源并修复校验和，一劳永逸，支持随时一键还原。

---

## 安全说明

动态汉化的原理是为目标应用开启本地 CDP 调试端口（默认仅监听 `127.0.0.1`），使用期间请注意：

- **端口不对用户隔离**：同一台电脑上的其它账户、以及本机任意进程都能访问该调试端口。工具已不再传入 `--remote-allow-origins=*`，避免浏览器侧通过 DNS rebinding 绕过同源限制；仍不建议在不可信的多用户机器上长时间挂着监视器。
- **端口未必是 58321**：普通版首选端口被占用时会改用 58322-58325；候选端口全部被占用则中止启动。普通版 2.23.0 自身默认会开启随机 CDP 端口，工具也会发现并复用它。复用前必须核对监听进程的应用身份与 CDP 接口，避免串连其他应用；普通版暂时没有窗口或正处于登录页面时也可复用浏览器级接口，之后只向符合条件的应用页面注入。日志会打印实际端口。
- **退出监视器 ≠ 关闭端口**：`Ctrl+C` 或 `--stop` 只结束监视进程，调试端口会保留到被汉化的应用退出为止。
- **启动路径校验**：从注册表（App Paths / 卸载信息）读到的候选路径，必须与目标可执行文件同名、且是普通文件（非目录或符号链接）才会被采用，避免把启动目标指向任意程序。
- **注入脚本是可信边界**：Unix 上，外部脚本及其目录须属于当前运行用户且不对同组/其他用户开放写权限，脚本还须包含汉化标记。Windows 不使用 Unix 权限位判断 ACL，默认使用内嵌词库，外部脚本需要 `--trust-external-overlay` 显式信任。无论是否显式信任，都拒绝符号链接、特殊文件以及超过 2 MiB 的脚本，避免 FIFO 阻塞或过量读取。权限和标记检查不是脚本签名，仍须确认来源可信。
- **权限提示中的目标保持原文**：只翻译授权模板，不改写命令、路径、URL 和规则内容；对未知授权模板保留原文。
- **词库更新有版本识别**：监视器会核对脚本内容指纹，新版词库会替换并清理上一版观察器。没有清理入口的旧版脚本需要先重新加载应用窗口，工具会给出提示，避免两套规则同时运行。
- 启动时会打印实际使用的脚本来源与 SHA-256 前缀，便于核对注入内容。
- macOS 上静态补丁会修改已签名 `.app` 的内容并重算 `product.json` 校验和，`codesign --verify` 将不再通过；长期使用建议优先选择动态汉化。

---

## 常见问题

- **macOS 双击「中文」图标后没有汉化**：监视进程日志位于 `~/Library/Logs/antigravity-hans.log`，先看该文件。
- **提示汉化监视器已在运行**：说明上一次的监视器仍在工作，可用 `antigravity-hans --stop` 结束它。
- **提示退出取消或超时**：仅在没有可复用调试端口时请求正常退出（macOS 用 AppleScript，Windows 用不带 `/F` 的 `taskkill`）。取消、拒绝或超时会中止重启，不会强杀应用；请保存内容并手动退出后重试。
- **更新后仍使用旧词库**：先结束旧监视器；如果日志提示旧脚本没有清理入口，重新加载当前应用窗口后再启动新版监视器。

---

## 源码编译

需要 **Go 1.26.9 或更高版本**（`go.mod` 已声明，旧工具链会自动下载对应版本）。

```bash
./build.sh    # 交叉编译 macOS / Windows 三个平台到 dist/
```
---

## 更新说明

### v0.4.5

**安全**

- 不再传入 `--remote-allow-origins=*`：CDP 调试端口本身无鉴权，该参数会关闭浏览器针对 DNS rebinding 的防护；本工具的 WebSocket 客户端默认不发送 Origin 头，并不需要它。
- 外部汉化脚本增加类型、所有者、权限、体积与汉化标记检查；Unix 默认校验脚本及目录，Windows 默认使用内嵌词库，显式信任仍保留类型与大小限制。
- 启动路径校验：注册表读到的候选路径必须与目标可执行文件同名，且启动前再次校验（存在 / 普通文件 / 非符号链接）。

**健壮性**

- 修复断线重连时递归调用导致的 Watchdog goroutine 泄漏，改为就地退避重连（1.5s → 5s，最长 30 秒）。
- macOS 与 Windows 均改为先请求应用**正常退出**；取消、拒绝或超时会中止重启，避免丢失正在进行的会话。
- 调试端口自动避让占用并支持复用；`--nogui` 下不再等待标准输入（原先多安装实例会永久挂起）。
- 新增监视器单实例锁与 `--stop`；macOS 快捷方式的监视进程日志落盘到 `~/Library/Logs/antigravity-hans.log`。

**词库与质量**

- 修复历史失效词条及沙盒确认框漏译，适配普通版 Antigravity 2.23.0，词库扩充至 1300 条。
- 尽可能调整了中英文夹杂的问题，修复了目前可见的中英文互相参杂的问题。
- 新增词库体检脚本 `tools/lint-overlay.mjs`，并接入 CI。
- Go 工具链升级到 1.26.9（1.25 已停止支持），新增 CI 质量门禁：gofmt / go vet / go test / 词库 lint / govulncheck。
- 补充权限目标保留、词库版本替换、动态文案与跳过区域回归测试。

### v0.4.4

- 词库引入短词精准匹配与智能体进度解析，完善全局权限与远程控制相关汉化。

---

## 致谢

- 本项目 fork 自 [yuexps/Antigravity-Hans](https://github.com/yuexps/Antigravity-Hans)，感谢原作者与所有贡献者。
- 汉化词库参考：[antigravity-chinese](https://github.com/kdczyz/antigravity-chinese)

