// Captures the screenshots and the short loop used in the README, from a running dev server.
//
//   npm run dev                     (in another terminal)
//   node scripts/shots.mjs [url] [stills|loop]    default url: http://127.0.0.1:5173/
//
// Stills need only a Chromium-based browser. The loop also needs ffmpeg on the PATH; without it the loop is skipped.

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openPage, sleep } from './browser.mjs';

const url = process.argv[2] ?? 'http://127.0.0.1:5173/';
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/img');
mkdirSync(out, { recursive: true });

// Sets a controlled input's value the way typing would, so React sees the change.
const helpers = `
  window.setValue = (id, value) => {
    const element = document.getElementById(id);
    const prototype = element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
    element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  };
  window.payButton = () => [...document.querySelectorAll('form')].find(form => form.closest('main')).querySelector(':scope > button[type=submit]');
  // Keep the pictures to the checkout itself: no demo-site link, no empty scrollbar gutter.
  document.querySelector('.site-pill')?.remove();
  document.documentElement.style.scrollbarGutter = 'auto';
  1`;
const fillForm = `
  setValue('email', 'ada@example.com'); setValue('first', 'Ada'); setValue('last', 'Lovelace');
  setValue('city', 'San Francisco'); setValue('region', 'CA'); setValue('postal', '94103');
  setValue('address1', '12 Market St');
  setValue('cc', '4242424242424242'); setValue('exp', '1230'); setValue('cvc', '123'); 1`;

// ---- Stills ----
const only = process.argv[3];   // 'stills' or 'loop' to do just one
if (only !== 'loop') {
  const page = await openPage({ width: 1280, height: 800, scale: 2 });
  await page.goto(url);
  await sleep(2500);
  await page.evaluate(helpers);
  await page.evaluate(fillForm);
  // Typing in the address line opens the suggestion list a moment later; Escape closes it.
  await sleep(500);
  await page.evaluate(`document.getElementById('address1').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); 1`);
  await sleep(2000);
  await page.evaluate(`window.scrollTo(0, 0); document.activeElement.blur(); 1`);
  await sleep(300);
  await page.screenshot(join(out, 'checkout-desktop.png'));

  await page.evaluate(`payButton().click()`);
  await sleep(6500);
  await page.screenshot(join(out, 'thank-you.png'));

  await page.evaluate(`location.hash = '#/components/choicelist'`);
  await sleep(1500);
  await page.screenshot(join(out, 'components.png'));
  page.close();

  const phone = await openPage({ width: 390, height: 844, scale: 2, mobile: true });
  await phone.goto(url);
  await sleep(2800);
  await phone.evaluate(helpers);
  await sleep(200);
  await phone.screenshot(join(out, 'checkout-mobile.png'));
  phone.close();
  console.log('Stills written to docs/img.');
}
if (only === 'stills') process.exit(0);

// ---- The loop: page load, typing, an address suggestion, rates, paying, the thank-you page ----
if (spawnSync('ffmpeg', ['-version']).status !== 0) {
  console.log('ffmpeg not found; skipping the loop.');
  process.exit(0);
}
{
  const frames = mkdtempSync(join(tmpdir(), 'checkout-frames-'));
  const page = await openPage({ width: 1200, height: 750, scale: 1 });
  let recording = true;
  let count = 0;
  // Called once the page has loaded: a capture requested before then never returns.
  const startRecording = async () => {
    while (recording) {
      const started = Date.now();
      await page.screenshot(join(frames, `frame_${String(count++).padStart(4, '0')}.png`));
      await sleep(Math.max(0, 80 - (Date.now() - started)));
    }
  };
  const typeInto = async (id, text, delay = 28) => {
    await page.evaluate(`document.getElementById('${id}').focus()`);
    for (const character of text) {
      await page.type(character);
      await sleep(delay);
    }
  };

  await page.goto(url);
  const record = startRecording();
  await sleep(2100);
  await page.evaluate(helpers);
  await typeInto('email', 'ada@example.com');
  await typeInto('first', 'Ada');
  await typeInto('last', 'Lovelace');
  await typeInto('address1', '12 mar', 70);
  await sleep(700);
  await page.press('ArrowDown');
  await sleep(350);
  await page.press('Enter');
  await sleep(600);
  await page.evaluate(`document.querySelector('h3').scrollIntoView({ behavior: 'smooth', block: 'center' }); 1`);
  await sleep(1700);
  await page.evaluate(`document.querySelectorAll('input[name=shipping]')[1]?.click(); 1`);
  await sleep(700);
  await page.evaluate(`document.getElementById('cc').scrollIntoView({ behavior: 'smooth', block: 'center' }); 1`);
  await sleep(700);
  await typeInto('cc', '4242424242424242', 22);
  await typeInto('exp', '1230', 40);
  await typeInto('cvc', '123', 40);
  await sleep(400);
  await page.evaluate(`payButton().scrollIntoView({ behavior: 'smooth', block: 'center' }); 1`);
  await sleep(700);
  await page.evaluate(`payButton().click()`);
  await sleep(7200);
  recording = false;
  await record;
  page.close();

  const gif = join(out, 'demo.gif');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '12.5', '-i', join(frames, 'frame_%04d.png'),
    '-vf', 'scale=880:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle', gif]);
  rmSync(frames, { recursive: true, force: true });
  console.log(`Loop written to docs/img/demo.gif from ${count} frames.`);
}
