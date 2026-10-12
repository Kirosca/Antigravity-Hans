package main

import (
	"os"
	"path/filepath"
	"strconv"
	"testing"
)

func TestAcquireMonitorLockIsExclusive(t *testing.T) {
	monitorStateDirOverride = t.TempDir()
	defer func() { monitorStateDirOverride = "" }()

	cfg := AppConfig{Name: "Antigravity", Port: 58321}

	release, ok := acquireMonitorLock(cfg)
	if !ok {
		t.Fatal("首次获取锁应当成功")
	}
	if _, ok := acquireMonitorLock(cfg); ok {
		t.Fatal("重复获取锁应当失败，避免重复监视器")
	}
	release()

	if _, ok := acquireMonitorLock(cfg); !ok {
		t.Fatal("释放后应当可以再次获取锁")
	}
}

func TestAcquireMonitorLockOverridesStalePID(t *testing.T) {
	monitorStateDirOverride = t.TempDir()
	defer func() { monitorStateDirOverride = "" }()

	cfg := AppConfig{Name: "Antigravity IDE", Port: 58322}
	path := monitorLockPath(cfg)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	// 一个几乎不可能存在的 PID，模拟异常退出留下的残留锁
	if err := os.WriteFile(path, []byte(strconv.Itoa(1<<30)), 0o600); err != nil {
		t.Fatal(err)
	}
	if _, ok := acquireMonitorLock(cfg); !ok {
		t.Fatal("残留锁文件不应阻断启动")
	}
}

func TestMonitorLockPathIsPerPort(t *testing.T) {
	monitorStateDirOverride = t.TempDir()
	defer func() { monitorStateDirOverride = "" }()
	if monitorLockPath(AppNormal) == monitorLockPath(AppIDE) {
		t.Fatal("两个应用应使用不同的锁文件，以便同时汉化")
	}
}
