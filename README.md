# Antigravity 汉化工具 (Antigravity-Hans)

专为 **Google Antigravity** 及 **Antigravity IDE** 开发的中文汉化工具。

> **适配版本**： **Antigravity `2.10.0`** 与 **Antigravity IDE `2.5.5`** 。

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
- **退出监视器 ≠ 关闭端口**：`Ctrl+C` 或 `--stop` 只结束监视进程，调试端口会保留到被汉化的应用退出为止。
- **注入脚本是可信边界**：可执行文件同目录下的 `antigravity-hans-overlay.js` 只有满足「普通文件 + 非符号链接 + 不同组/其他用户可写 + 含汉化标记」才会被采用，否则自动退回编译期内嵌版本。`--trust-external-overlay` 会跳过这些校验，仅建议在本机调试词库时使用。
- 启动时会打印实际使用的脚本来源与 SHA-256 前缀，便于核对注入内容。
- macOS 上静态补丁会修改已签名 `.app` 的内容并重算 `product.json` 校验和，`codesign --verify` 将不再通过；长期使用建议优先选择动态汉化。

---

## 常见问题

- **macOS 双击「中文」图标后没有汉化**：监视进程日志位于 `~/Library/Logs/antigravity-hans.log`，先看该文件。
- **提示汉化监视器已在运行**：说明上一次的监视器仍在工作，可用 `antigravity-hans --stop` 结束它。

---

## 源码编译

```bash
./build.sh
```

---

## 致谢

- 汉化词库参考：[antigravity-chinese](https://github.com/kdczyz/antigravity-chinese)

