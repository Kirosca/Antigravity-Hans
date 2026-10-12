package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/shirou/gopsutil/v4/process"
)

// monitorStateDirOverride 仅用于测试时改写监视器状态目录
var monitorStateDirOverride string

// monitorStateDir 返回存放监视器锁文件的目录
func monitorStateDir() string {
	if monitorStateDirOverride != "" {
		return monitorStateDirOverride
	}
	if base, err := os.UserConfigDir(); err == nil && base != "" {
		return filepath.Join(base, "antigravity-hans")
	}
	return filepath.Join(os.TempDir(), "antigravity-hans")
}

// monitorLockPath 按端口区分锁文件，允许同时为 Antigravity 与 Antigravity IDE 各跑一个监视器
func monitorLockPath(cfg AppConfig) string {
	return filepath.Join(monitorStateDir(), fmt.Sprintf("monitor-%d.pid", cfg.Port))
}

// monitorTargets 根据 --app / --ide 参数决定目标；未指定时两者都算
func monitorTargets(args []string) []AppConfig {
	isApp := containsArg(args, "--app") || containsArg(args, "-app")
	isIDE := containsArg(args, "--ide") || containsArg(args, "-ide")
	switch {
	case isApp && !isIDE:
		return []AppConfig{AppNormal}
	case isIDE && !isApp:
		return []AppConfig{AppIDE}
	default:
		return []AppConfig{AppNormal, AppIDE}
	}
}

// readLockPID 读取锁文件中记录的 PID
func readLockPID(path string) (int32, bool) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, false
	}
	pid, err := strconv.ParseInt(strings.TrimSpace(string(data)), 10, 32)
	if err != nil || pid <= 0 {
		return 0, false
	}
	return int32(pid), true
}

// isOwnMonitor 判断某个 PID 是否确实是本工具的监视器进程，避免 PID 复用导致误杀
func isOwnMonitor(pid int32) bool {
	proc, err := process.NewProcess(pid)
	if err != nil {
		return false
	}
	if exe, err := proc.Exe(); err == nil && exe != "" {
		if self, err := os.Executable(); err == nil && samePath(exe, self) {
			return true
		}
	}
	name, err := proc.Name()
	if err != nil {
		return false
	}
	return strings.Contains(strings.ToLower(name), "antigravity-hans")
}

func samePath(a, b string) bool {
	return strings.EqualFold(filepath.Clean(a), filepath.Clean(b))
}

// acquireMonitorLock 为某个应用获取独占的监视器锁。
// 已有存活实例时返回 ok=false；锁文件不可写时不阻断主流程。
func acquireMonitorLock(cfg AppConfig) (func(), bool) {
	path := monitorLockPath(cfg)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		fmt.Printf("[提示] 无法创建监视器状态目录 (%v)，本次不做单实例保护。\n", err)
		return func() {}, true
	}

	if pid, ok := readLockPID(path); ok {
		if alive, _ := process.PidExists(pid); alive && isOwnMonitor(pid) {
			fmt.Printf("[提示] 检测到 %s 的汉化监视器已在运行 (PID: %d)，本次不再重复启动。\n", cfg.Name, pid)
			fmt.Printf("       如需结束它，请执行: %s --stop\n", filepath.Base(os.Args[0]))
			return nil, false
		}
	}

	f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		fmt.Printf("[提示] 无法写入监视器锁文件 (%v)，本次不做单实例保护。\n", err)
		return func() {}, true
	}
	if _, err := f.WriteString(strconv.Itoa(os.Getpid())); err != nil {
		fmt.Printf("[提示] 无法写入监视器锁文件 (%v)，本次不做单实例保护。\n", err)
	}
	_ = f.Close()

	return func() { _ = os.Remove(path) }, true
}

// stopMonitors 结束由本工具启动的汉化监视器进程；不会结束被汉化的应用本身
func stopMonitors(cfgs []AppConfig) {
	stopped := 0
	for _, cfg := range cfgs {
		path := monitorLockPath(cfg)
		pid, ok := readLockPID(path)
		if !ok {
			continue
		}
		if alive, _ := process.PidExists(pid); !alive {
			_ = os.Remove(path)
			continue
		}
		if !isOwnMonitor(pid) {
			fmt.Printf("[警告] PID %d 已不是本工具的监视器（PID 可能被复用），已跳过。\n", pid)
			continue
		}
		p, err := os.FindProcess(int(pid))
		if err != nil {
			fmt.Printf("[错误] 无法定位 %s 的监视器 (PID: %d): %v\n", cfg.Name, pid, err)
			continue
		}
		if err := p.Kill(); err != nil {
			fmt.Printf("[错误] 结束 %s 的监视器 (PID: %d) 失败: %v\n", cfg.Name, pid, err)
			continue
		}
		_ = os.Remove(path)
		fmt.Printf("[成功] 已结束 %s 的汉化监视器 (PID: %d)。\n", cfg.Name, pid)
		stopped++
	}
	if stopped == 0 {
		fmt.Println("[提示] 未发现正在运行的汉化监视器。")
	}
	fmt.Println("[提示] 被汉化应用的调试端口会保留到该应用退出为止。")
}
