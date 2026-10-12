package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// LaunchWithDebug 以调试模式后台启动 App
func LaunchWithDebug(appPath string, port int) error {
	args := []string{
		appPath,
		fmt.Sprintf("--remote-debugging-port=%d", port),
	}

	// 默认不再传入 --remote-allow-origins=*：
	// Chromium 仅在 WebSocket 请求携带非白名单 Origin 时才会拒绝，而 gorilla/websocket
	// 默认不发送 Origin 头，所以本工具并不需要该参数；而通配它会关闭浏览器针对
	// DNS rebinding 的保护，使本地调试端口暴露给任意网页或同机其他用户。
	// 仅在排查注入问题时，才用环境变量临时恢复旧行为。
	if os.Getenv("AGY_HANS_ALLOW_ANY_ORIGIN") == "1" {
		fmt.Println("[警告] 已启用 AGY_HANS_ALLOW_ANY_ORIGIN=1，调试端口将接受任意 Origin（存在安全风险）。")
		args = append(args, "--remote-allow-origins=*")
	}
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Dir = filepath.Dir(appPath)
	cmd.Stdout = nil
	cmd.Stderr = nil
	cmd.Stdin = nil

	setSysProcAttr(cmd) // 平台特定的进程属性（detach）

	return cmd.Start()
}

// gracefulQuitTimeout 是等待应用正常退出的最长时间，超时后才会强制结束。
const gracefulQuitTimeout = 8 * time.Second

// KillProcess 结束目标 App 进程并确保完全退出。
// macOS 上会先请求应用正常退出（触发保存 / 热退出流程），避免直接 SIGKILL
// 让用户丢失正在进行的会话与未落盘内容；超时后才退回强制结束。
func KillProcess(cfg AppConfig) {
	if requestGracefulQuit(cfg) {
		fmt.Printf("正在请求 %s 正常退出（保存状态）...\n", cfg.Name)
		if waitForAppExit(cfg, gracefulQuitTimeout) {
			fmt.Printf("[成功] %s 已正常退出。\n", cfg.Name)
			return
		}
		fmt.Printf("[提示] %s 未在 %s 内退出，改为强制结束。\n", cfg.Name, gracefulQuitTimeout)
	}

	fmt.Printf("正在强制结束已运行的 %s 实例...\n", cfg.Name)
	KillApp(cfg)
	// 等待所有残留进程彻底退出，避免 SingleInstanceLock 抢占导致新实例自杀
	for i := 0; i < 30; i++ {
		time.Sleep(100 * time.Millisecond)
		app := DetectApp(cfg)
		if !app.Running {
			break
		}
	}
}

// waitForAppExit 在超时时间内轮询等待应用完全退出
func waitForAppExit(cfg AppConfig, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for {
		if !DetectApp(cfg).Running {
			return true
		}
		if time.Now().After(deadline) {
			return false
		}
		time.Sleep(200 * time.Millisecond)
	}
}

// fileExists 判断文件是否存在
func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
