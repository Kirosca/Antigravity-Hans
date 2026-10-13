import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(new URL('../antigravity-hans-overlay.js', import.meta.url), 'utf8');
const context = { window: { addEventListener() {}, removeEventListener() {} }, document: { readyState: 'loading' } };
vm.createContext(context);
vm.runInContext(source.replace('  function run() {', '  globalThis.translateForTest = translate; globalThis.translateElementForTest = translateElement;\n  function run() {'), context);
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
  const targets = ['/workspace/10 files/30 minutes.txt', "rm -rf '/tmp/10 files'", 'https://example.test/10 files?q=30 minutes', "printf '$& $$ $` $\u0027'", "tool('10 files')\nnext command", '复制中文和10 files'];
  for (const target of targets) {
    const inputs = [
      `Requesting permission to running this command outside the sandbox ${target}`,
      `Requesting permission to read access to this path ${target}`,
      `Requesting permission to using this MCP tool ${target}`,
      `Agent needs permission to execute JavaScript on ${target}`,
      `Agent needs permission to act on ${target}`,
      `Yes, save rule for '${target}' in this project`,
      `Yes, and always allow '${target}' in this workspace`,
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

test('attribute mutations inside skipped code/user content are not translated', () => {
  context.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
  let altered = false;
  const element = { nodeType: 1, closest(selector) { return selector.includes('script, style') ? this : null; }, getAttribute() { return 'Code Search'; }, setAttribute() { altered = true; } };
  context.translateElementForTest(element);
  assert.equal(altered, false);
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
