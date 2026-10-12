//go:build darwin

package main

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// requestGracefulQuit 在 macOS 上通过 AppleScript 请求目标应用正常退出。
// 正常退出会走 Electron / VS Code 的保存与热退出（hot exit）流程，
// 避免直接 SIGKILL 丢失用户正在进行的会话与未落盘内容。
// 任何一步失败都返回 false，由调用方退回原有的强制结束流程。
func requestGracefulQuit(cfg AppConfig) bool {
	bundle := macBundlePath(cfg)
	if bundle == "" {
		return false
	}
	if _, err := exec.LookPath("osascript"); err != nil {
		return false
	}

	fmt.Println("       (macOS 可能弹出“想要控制 Antigravity”的授权提示，允许一次即可)")
	script := fmt.Sprintf("tell application %q to quit", bundle)
	return exec.Command("osascript", "-e", script).Run() == nil
}

// macBundlePath 返回正在运行（或已安装）实例对应的 .app 路径
func macBundlePath(cfg AppConfig) string {
	exe := DetectApp(cfg).Path
	if exe == "" {
		for _, p := range cfg.PossiblePaths {
			if fileExists(p) {
				exe = p
				break
			}
		}
	}
	if exe == "" {
		return ""
	}
	// .../Foo.app/Contents/MacOS/Foo -> .../Foo.app
	app := filepath.Dir(filepath.Dir(filepath.Dir(exe)))
	if strings.HasSuffix(app, ".app") {
		return app
	}
	return ""
}
