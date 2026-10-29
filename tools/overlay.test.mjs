import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(new URL('../antigravity-hans-overlay.js', import.meta.url), 'utf8');
const context = { window: { addEventListener() {}, removeEventListener() {}, location: { pathname: '/', href: 'http://127.0.0.1/' } }, document: { readyState: 'loading' } };
vm.createContext(context);
vm.runInContext(source.replace('  function run() {', '  globalThis.translateForTest = translate; globalThis.translateElementForTest = translateElement; globalThis.translateNodeForTest = translateNode;\n  function run() {'), context);
const translate = context.translateForTest;

test('updated overlays replace their observer and use the requested fingerprint', () => {
  const fresh = { window: { addEventListener() {}, removeEventListener() {} }, document: { readyState: 'loading' } };
  vm.createContext(fresh);
  fresh.window.__antigravityZhPatchRequestedFingerprint = 'first';
  vm.runInContext(source, fresh);
  const previousCleanup = fresh.window.__antigravityZhPatchCleanup;
  fresh.window.__antigravityZhPatchRequestedFingerprint = 'second';
  vm.runInContext(source, fresh);
  assert.equal(fresh.window.__antigravityZhPatchFingerprint, 'second');
  assert.notEqual(fresh.window.__antigravityZhPatchCleanup, previousCleanup);
  const currentCleanup = fresh.window.__antigravityZhPatchCleanup;
  vm.runInContext(source, fresh);
  assert.equal(fresh.window.__antigravityZhPatchCleanup, currentCleanup, 'same version installed a duplicate observer');
});

test('permission targets survive both initial translation and observer reprocessing', () => {
  const targets = ['/workspace/10 files/30 minutes.txt', "rm -rf '/tmp/10 files'", 'https://example.test/10 files?q=30 minutes', "printf '$& $$ $` $\u0027'", "tool('10 files')\nnext command", '复制中文和10 files', 'Last 7 days', 'Last 7 天'];
  for (const target of targets) {
    const inputs = [
      `Requesting permission to running this command outside the sandbox ${target}`,
      `Requesting permission to read access to this path ${target}`,
      `Requesting permission to using this MCP tool ${target}`,
      `Requesting permission to run (unsandboxed) ${target}`,
      `Requesting permission to read ${target}`,
      `Agent needs permission to execute JavaScript on ${target}`,
      `Agent needs permission to act on ${target}`,
      `Yes, save rule for '${target}' in this conversation`,
      `Yes, save rule for '${target}' in this project`,
      `Yes, and always allow '${target}' in this conversation`,
      `Yes, and always allow '${target}' in this workspace`,
      `Conflicts with your configured Ask permission: ${target}`,
      `Requires manual confirmation: ${target}`,
      `Allow ${target}`,
    ];
    for (const input of inputs) {
      const result = translate(input);
      assert.ok(result.includes(target), `${input} -> ${result}`);
      assert.equal(translate(result), result, 'observer reprocessing changed an authorization target');
      assert.ok(!result.includes('在在'), 'scope prefix duplicated');
    }
  }
  assert.equal(translate('Requesting permission to running this command outside the sandbox echo ok'), '正在请求权限：在沙盒外运行此命令 echo ok');
  const unknown = 'Requesting permission to unknown new action /10 files';
  assert.equal(translate(unknown), unknown);
});

test('2.23.0 normal app controls and safety policies are localized', () => {
  for (const [input, expected] of [
    ['Code Search', '代码搜索'], ['Add to Chat', '添加到对话'], ['Chief of Staff', '统筹助手'],
    ['Manage Hooks', '管理钩子'], ['Sandbox Allow Network', '允许沙盒访问网络'],
    ['Agent always asks for review.', '智能体始终请求审核。'], ['Reject Step', '拒绝此步骤'],
    ['New Window', '新建窗口'], ['Select branch', '选择分支'],
    ['Vetted (Preview)', '安全审核（预览）'], ['Automatic Check for Updates', '自动检查更新'],
    ['Browser Actuation Permissions', '浏览器操作权限'], ['Terms of Service & Data Use', '服务条款与数据使用'],
    ['Allow read access to this path?', '允许读取此路径？'], ['Save rule to always allow running this command?', '保存规则以始终允许运行此命令？'],
    ['Explored, ran command', '已探索，已运行命令'], ['Explored, edited files', '已探索，已编辑文件'],
    ['Worked for 1h 20m', '已工作 1 小时 20 分钟'], ['Stopped after 45s', '工作 45 秒后停止'],
    ['Thinking for 3s', '已思考 3 秒'], ['3 files changed', '3 个文件已更改'],
  ]) assert.equal(translate(input), expected);
});

test('2.25.0 normal app controls, workspaces and debug view are localized', () => {
  for (const [input, expected] of [
    ['Open Trajectory Debug View', '打开轨迹调试视图'],
    ['Copy Trajectory ID', '复制轨迹 ID'],
    ['CitC Workspace', 'CitC 工作区'],
    ['Work in a CitC workspace.', '在 CitC 工作区中开展工作。'],
    ['Cog Workspace', 'Cog 工作区'],
    ['ABFS Workspace (Alpha)', 'ABFS 工作区（Alpha）'],
    ['Prompt to execute on schedule...', '按计划执行的提示词…'],
    ['Schedules only.', '仅限计划任务。'],
    ['New: Per-Conversation Telemetry', '新功能：按对话独立设置遥测'],
    ['File Explorer', '文件资源管理器'],
    ['Upload to Google Drive', '上传到 Google 云端硬盘'],
    ['Open in Tab', '在标签页中打开'],
    ['Connect to WSL', '连接到 WSL'],
    ['Reopen Locally', '在本地重新打开'],
    ['Downloading Update', '正在下载更新'],
    ['Restart to Update', '重启以更新'],
  ]) assert.equal(translate(input), expected);
});

test('2.26.0 normal app controls, built-in browser, and workspaces are localized', () => {
  for (const [input, expected] of [
    ['Fork in Current Workspace', '在当前工作区创建分支'],
    ['Fork in Shared Workspace', '在共享工作区创建分支'],
    ['Fork in New Workspace', '在新工作区创建分支'],
    ['Built-in Browser Requires Isolated Web App (IWA)', '内置浏览器需要独立网页应用 (IWA)'],
    ['Open in Jetski IWA', '在 Jetski IWA 中打开'],
    ['Add Custom Model', '添加自定义模型'],
    ['Select Billing Model', '选择计费模型'],
    ['Agent Team', '智能体团队'],
    ['Did what I wanted', '符合预期'],
    ['Incomplete / Gave up', '未完成 / 中途放弃'],
    ['Business Account Sign In', '企业账号登录'],
    ['Hide Thumbnail Sidebar', '隐藏缩略图侧边栏'],
    ['Mermaid diagram', 'Mermaid 架构图'],
    ['Voice Mode', '语音模式'],
  ]) assert.equal(translate(input), expected);
});

test('2.27.0 normal app controls, token budget, voice picker, and git staging are localized', () => {
  for (const [input, expected] of [
    ["Choose Jetski's Voice", "选择 Jetski 的音色"],
    ['Customization token budget exceeded. Large customizations are excluded from context.', '自定义项 Token 预算超限。大型自定义项已从上下文中排除。'],
    ['Both staged and unstaged changes are being committed.', '暂存区与未暂存的更改均将被提交。'],
    ['Only staged changes are being committed.', '仅暂存区的更改将被提交。'],
    ['Pin Tab', '固定标签页'],
    ['Unpin Tab', '取消固定标签页'],
    ['Close Other Tabs', '关闭其他标签页'],
    ['Close Tabs to the Right', '关闭右侧标签页'],
    ['New tab', '新建标签页'],
    ['Reload this window.', '重新加载此窗口。'],
    ['Open Tabs', '打开的标签页'],
    ['Give Feedback', '提供反馈'],
    ['Best of N', '多选优 (Best of N)'],
    ['Agent Settings', '智能体设置'],
    ['Terminal Disabled on Non-Corp Domains', '非公司内网域名已禁用终端'],
    ['Daily limit', '每日限额'],
    ['Weekly limit', '每周限额'],
    ['Get More AI Credits', '获取更多 AI 积分'],
    ['See Activity', '查看活动'],
  ]) assert.equal(translate(input), expected);
});

test('2.28.0 normal app controls, auxiliary pane, shortcuts, browser actions, and security are localized', () => {
  for (const [input, expected] of [
    ['Toggle Maximize Auxiliary Pane', '切换最大化辅助面板'],
    ['Sidecar View', 'Sidecar 视图'],
    ['Edit Shortcut', '编辑快捷键'],
    ['Reset all shortcuts to defaults', '将所有快捷键重置为默认值'],
    ['Search flags', '搜索 Flag 标志'],
    ['Turn on a flag you don\'t have', '开启未拥有的实验性 Flag'],
    ['Override feature environment', '覆盖功能环境'],
    ['Start Live Chat', '开始实时语音通话'],
    ['View site information', '查看网站信息'],
    ['Connection is secure', '连接是安全的'],
    ['Certificate details', '证书详情'],
    ['Simulating Key Press in Browser', '在浏览器中模拟按键'],
    ['Extracting DOM elements', '正在提取 DOM 元素'],
    ['MCP App', 'MCP 应用'],
    ['Add Hook Card', '添加 Hook 卡片'],
    ['Requesting your permission in Terminal:', '在终端中请求您的权限:'],
    ['Undo restores your entire workspace to its state at this point.', '撤销将使您的整个工作区恢复到此时的状态。'],
    ['Cannot start best-of-N mode while the agent is running', '智能体运行期间无法启动 Best of N 模式'],
    ['PDF file size exceeds 10MB limit', 'PDF 文件大小超过 10MB 限制'],
    ['Delete All Remote Agents Data', '删除所有远程智能体数据'],
  ]) assert.equal(translate(input), expected);
});

test('2.28.1 marketplace notice, third-party disclaimer, and basic UI controls are localized', () => {
  for (const [input, expected] of [
    ['Marketplace notice', '插件市场声明'],
    ['Plugin metadata', '插件元数据'],
    ['No plugins match your search.', '没有找到符合您搜索的插件。'],
    ['No plugins available in the marketplace.', '市场中暂无可用插件。'],
    ['Malformed third party tools disclaimer flag', '第三方工具免责声明 Flag 格式错误'],
    ['This Computer', '此电脑'],
    ['Background Commands', '后台命令'],
    ['Auto (detected)', '自动 (已检测)'],
    ['Render failed', '渲染失败'],
    ['projectManagementService is not available', '项目管理服务不可用'],
  ]) assert.equal(translate(input), expected);
});

test('WSL provisioning translates status while preserving the distro name', () => {
  const name = 'Ubuntu 10 files';
  for (const input of [`Setting up WSL: ${name}`, `Installing into ${name}…`]) {
    const output = translate(input);
    assert.ok(output.includes(name));
    assert.equal(translate(output), output);
  }
  assert.equal(translate('Downloading the Antigravity binary…'), '正在下载 Antigravity 程序…');
});

test('recent-day filters translate fully and repair partially translated labels', () => {
  for (const input of ['Last 7 days', 'Last 7 天', 'Last 1 day', 'Last 30 days', ' Last 30 天 ']) {
    const count = input.match(/\d+/)[0];
    const expected = input.replace(input.trim(), `最近 ${count} 天`);
    const output = translate(input);
    assert.equal(output, expected);
    assert.equal(translate(output), output, 'observer reprocessing changed a translated time filter');
  }
  assert.equal(translate('Last Updated'), '最近更新');
  assert.equal(translate('Last Prompt'), '上次提示词');
});

test('attribute mutations inside skipped code/user content are not translated', () => {
  context.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
  let altered = false;
  const element = { nodeType: 1, closest(selector) { return selector.includes('script, style') ? this : null; }, getAttribute() { return 'Code Search'; }, setAttribute() { altered = true; } };
  context.translateElementForTest(element);
  assert.equal(altered, false);

  const attrs = new Map([['placeholder', '(tell the agent what to do instead)'], ['aria-label', 'Edit permission target']]);
  const textarea = {
    nodeType: 1,
    parentElement: { closest() { return null; } },
    closest() { return null; },
    getAttribute(name) { return attrs.get(name); },
    setAttribute(name, val) { attrs.set(name, val); },
  };
  context.translateElementForTest(textarea);
  assert.equal(attrs.get('placeholder'), '（告诉智能体改做什么）');
  assert.equal(attrs.get('aria-label'), '编辑权限目标');
});

test('synchronous translation prevents dialog flash without destructive opacity rules', () => {
  assert.doesNotMatch(source, /\[role="dialog"\]:not/);
  assert.doesNotMatch(source, /opacity:\s*0\s*!important/);
  assert.match(source, /antigravity-zh-smooth-style/);
});

test('lint catches untranslated words and permission polarity reversals', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-lexicon-test-'));
  try {
    const file = path.join(dir, 'fixture.js');
    fs.writeFileSync(file, "const phrases = new Map([\n    ['Test label', 'untranslated'],\n  ]);\n");
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./lint-overlay.mjs', import.meta.url)), file], { encoding: 'utf8' });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /译文残留英文 untranslated/);
    fs.writeFileSync(file, "const phrases = new Map([\n    ['Deny', '允许'],\n  ]);\n");
    const denied = spawnSync(process.execPath, [fileURLToPath(new URL('./lint-overlay.mjs', import.meta.url)), file], { encoding: 'utf8' });
    assert.equal(denied.status, 1);
    assert.match(denied.stdout, /语义反转/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
