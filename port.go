package main

import (
	"fmt"
	"net"
)

// portFallbackCount 是首选端口被占用时继续尝试的备用端口数量
const portFallbackCount = 4

// candidatePorts 返回首选端口及其备用端口。
// 端口落在系统临时端口区间内（macOS / Windows 默认 49152-65535），
// 任何进程的瞬时出站连接都可能占用，因此必须准备备用端口。
func candidatePorts(preferred int) []int {
	ports := make([]int, 0, portFallbackCount+1)
	for i := 0; i <= portFallbackCount; i++ {
		ports = append(ports, preferred+i)
	}
	return ports
}

// isPortFree 判断本机 127.0.0.1 上该端口当前是否可绑定
func isPortFree(port int) bool {
	ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
	if err != nil {
		return false
	}
	_ = ln.Close()
	return true
}

// findCDPPort 在候选端口里寻找已经提供 CDP 服务的端口（通常是上一次由本工具启动的实例）。
// 找到时返回 (端口, true)：此时应当直接复用监视，而不是把应用杀掉重启。
func findCDPPort(preferred int) (int, bool) {
	for _, port := range candidatePorts(preferred) {
		if len(CheckPort(port)) > 0 {
			return port, true
		}
	}
	return 0, false
}

// selectFreePort 返回第一个可绑定的候选端口；全部被占用时返回 (首选端口, false)
func selectFreePort(preferred int) (int, bool) {
	for _, port := range candidatePorts(preferred) {
		if isPortFree(port) {
			return port, true
		}
	}
	return preferred, false
}
