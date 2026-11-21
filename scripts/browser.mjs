// A minimal driver for a headless Chromium-based browser over the DevTools Protocol.
// No dependencies: it uses Node's built-in fetch and WebSocket (Node 22 or newer).

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env.BROWSER_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const KEYS = { Tab: 9, Enter: 13, Escape: 27, ' ': 32, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40 };

/**
 * Opens one page in a headless browser.
 * Options: width, height, scale (device pixel ratio), mobile, reducedMotion.
 */
export async function openPage({ width = 1440, height = 900, scale = 1, mobile = false, reducedMotion = false } = {}) {
  const executable = CANDIDATES.find(path => existsSync(path));
  if (!executable) throw new Error('No Chromium-based browser found. Set BROWSER_PATH to one.');

  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = mkdtempSync(join(tmpdir(), 'checkout-browser-'));
  const child = spawn(executable, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    // A headless page counts as a background page, and background timers are slowed to one tick a second.
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });

  let target;
  for (let attempt = 0; attempt < 80 && !target; attempt++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find(entry => entry.type === 'page');
    } catch {
      // The browser is still starting.
    }
    if (!target) await sleep(250);
  }
  if (!target) {
    child.kill();
    throw new Error('The browser did not start.');
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });

  let nextId = 0;
  const pending = new Map();
  const waiting = new Map();
  /** Uncaught exceptions and console errors seen on the page. */
  const errors = [];
  socket.onmessage = message => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
      return;
    }
    if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.exception?.description ?? data.params.exceptionDetails.text);
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push(data.params.args.map(arg => arg.value ?? arg.description).join(' '));
    const resolvers = waiting.get(data.method);
    if (resolvers) {
      waiting.delete(data.method);
      resolvers.forEach(resolve => resolve(data.params));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const once = method => new Promise(resolve => waiting.set(method, [...(waiting.get(method) ?? []), resolve]));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile });
  if (reducedMotion) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

  return {
    send,
    errors,
    /** Loads a URL and waits for its load event. */
    async goto(url) {
      const loaded = once('Page.loadEventFired');
      await send('Page.navigate', { url });
      await loaded;
    },
    /** Runs an expression in the page and returns its value. Promises are awaited. */
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
      return result.result.value;
    },
    /** Saves a PNG. `clip` is { x, y, width, height } in page pixels; without it, the viewport. */
    async screenshot(file, clip) {
      const result = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
      writeFileSync(file, Buffer.from(result.data, 'base64'));
    },
    /** Presses one key: 'Tab', 'Enter', 'Escape', ' ', an arrow, or a single character. */
    async press(key, { shift = false } = {}) {
      const code = KEYS[key] ?? key.toUpperCase().charCodeAt(0);
      const text = key.length === 1 ? key : key === 'Enter' ? '\r' : undefined;
      const base = { key, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, modifiers: shift ? 8 : 0 };
      await send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', ...base, ...(text ? { text } : {}) });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    },
    /** Types text into the focused element, as a keyboard would. */
    async type(text) {
      for (const character of text) {
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: character, text: character });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: character });
      }
    },
    close() {
      socket.close();
      child.kill();
      rmSync(profile, { recursive: true, force: true });
    },
  };
}
