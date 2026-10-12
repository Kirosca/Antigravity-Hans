//go:build !darwin && !windows

package main

// requestGracefulQuit 目前仅在 macOS（AppleScript）与 Windows（taskkill）上实现，
// 其它平台沿用原有的强制结束流程。
func requestGracefulQuit(cfg AppConfig) bool {
	return false
}
