# Antigravity 汉化工具 (Antigravity-Hans)

专为 **Google Antigravity** 及 **Antigravity IDE** 开发的中文汉化工具。

> **适配版本**：**Antigravity `2.22.0`** 与 **Antigravity IDE `2.5.5`**。
>
> 动态汉化基于 CDP 注入，不依赖应用内部结构，版本升级一般不受影响；静态补丁与 IDE 内部目录结构强相关，IDE 升级后可能需要重新适配。

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
antigravity-hans --trust-external-overlay  # 跳过校验，强制加载同目录外部汉化脚本
```

---

## 汉化模式

1. **动态汉化（推荐）**：
   - 支持 Antigravity 及 Antigravity IDE。
   - 基于 CDP 远程调试协议无感注入，不修改任何本地二进制与文件，安全无痕。
   - 可通过 `--shortcut` 参数一键生成桌面快捷方式，日常双击即可自动启动汉化。
2. **静态补丁（仅支持 Antigravity IDE）**：
   - 直接修改本地 IDE 安装包资源并修复校验和，一劳永逸，支持随时一键还原。

---

## 安全说明

动态汉化的原理是为目标应用开启本地 CDP 调试端口（默认仅监听 `127.0.0.1`），使用期间请注意：

- **端口不对用户隔离**：同一台电脑上的其它账户、以及本机任意进程都能访问该调试端口。工具已不再传入 `--remote-allow-origins=*`，避免浏览器侧通过 DNS rebinding 绕过同源限制；仍不建议在不可信的多用户机器上长时间挂着监视器。
- **端口未必是 58321**：首选端口落在系统临时端口区间内，被占用时会自动改用备用端口（58322-58325），启动日志会打印实际端口；再次启动时若发现某个候选端口已有调试端点，会直接复用它而不是把应用杀掉重启。
- **退出监视器 ≠ 关闭端口**：`Ctrl+C` 或 `--stop` 只结束监视进程，调试端口会保留到被汉化的应用退出为止。
- **启动路径校验**：从注册表（App Paths / 卸载信息）读到的候选路径，必须与目标可执行文件同名、且是普通文件（非目录或符号链接）才会被采用，避免把启动目标指向任意程序。
- **注入脚本是可信边界**：可执行文件同目录下的 `antigravity-hans-overlay.js` 只有满足「普通文件 + 非符号链接 + 不同组/其他用户可写 + 含汉化标记」才会被采用，否则自动退回编译期内嵌版本。`--trust-external-overlay` 会跳过这些校验，仅建议在本机调试词库时使用。
- 启动时会打印实际使用的脚本来源与 SHA-256 前缀，便于核对注入内容。
- macOS 上静态补丁会修改已签名 `.app` 的内容并重算 `product.json` 校验和，`codesign --verify` 将不再通过；长期使用建议优先选择动态汉化。

---

## 常见问题

- **macOS 双击「中文」图标后没有汉化**：监视进程日志位于 `~/Library/Logs/antigravity-hans.log`，先看该文件。
- **提示汉化监视器已在运行**：说明上一次的监视器仍在工作，可用 `antigravity-hans --stop` 结束它。
- **双击快捷方式后应用先被关闭再重启**：工具会先请求应用**正常退出**（macOS 用 AppleScript，Windows 用不带 `/F` 的 `taskkill`），macOS 最多等 8 秒、Windows 最多 5 秒，超时才强制结束。若应用被配置为「关闭窗口后继续在后台运行」而拒绝退出，就会走到强制结束。

---

## 源码编译

需要 **Go 1.26.9 或更高版本**（`go.mod` 已声明，旧工具链会自动下载对应版本）。

```bash
./build.sh    # 交叉编译 macOS / Windows 三个平台到 dist/
```

提交前建议本地跑一遍与 CI 相同的检查：

```bash
gofmt -l .                                     # 应无输出
go vet ./...
go test ./...
node tools/lint-overlay.mjs                    # 词库体检：死条目 / 重复键 / 权限词反转
go run golang.org/x/vuln/cmd/govulncheck@v1.9.0 ./...
```

> 修改词库后务必执行 `node tools/lint-overlay.mjs`：它会拦下“键里混入反斜杠导致永远匹配不到”
> 这类肉眼看不出来的问题（历史上曾有 11 条因此失效）。

---

## 更新说明

### v0.5.0

**安全**

- 不再传入 `--remote-allow-origins=*`：CDP 调试端口本身无鉴权，该参数会关闭浏览器针对 DNS rebinding 的防护；本工具的 WebSocket 客户端默认不发送 Origin 头，并不需要它。
- 外部汉化脚本增加完整性校验（普通文件 / 非符号链接 / 不同组其他用户可写 / 体积上限 / 含汉化标记），不通过则自动退回编译期内嵌版本。
- 启动路径校验：注册表读到的候选路径必须与目标可执行文件同名，且启动前再次校验（存在 / 普通文件 / 非符号链接）。

**健壮性**

- 修复断线重连时递归调用导致的 Watchdog goroutine 泄漏，改为就地退避重连（1.5s → 5s，最长 3 分钟）。
- macOS 与 Windows 均改为先请求应用**正常退出**，超时才强制结束，避免丢失正在进行的会话。
- 调试端口自动避让占用并支持复用；`--nogui` 下不再等待标准输入（原先多安装实例会永久挂起）。
- 新增监视器单实例锁与 `--stop`；macOS 快捷方式的监视进程日志落盘到 `~/Library/Logs/antigravity-hans.log`。

**词库与质量**

- 修复 11 条因转义错误而永远匹配不到的词条，删除 5 条冗余条目，修正沙盒确认框漏译（811 → 806 条）。
- 新增词库体检脚本 `tools/lint-overlay.mjs`，并接入 CI。
- Go 工具链升级到 1.26.9（1.25 已停止支持），新增 CI 质量门禁：gofmt / go vet / go test / 词库 lint / govulncheck。
- 单元测试由 3 个增加到 16 个。

### v0.4.4

- 词库引入短词精准匹配与智能体进度解析，完善全局权限与远程控制相关汉化。

---

## 致谢

- 本项目 fork 自 [yuexps/Antigravity-Hans](https://github.com/yuexps/Antigravity-Hans)，感谢原作者与所有贡献者。
- 汉化词库参考：[kdczyz/antigravity-chinese](https://github.com/kdczyz/antigravity-chinese)

