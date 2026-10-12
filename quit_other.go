//go:build !darwin

package main

// requestGracefulQuit 目前仅在 macOS 上实现（通过 AppleScript 请求正常退出），
// 其它平台沿用原有的强制结束流程。
func requestGracefulQuit(cfg AppConfig) bool {
	return false
}
