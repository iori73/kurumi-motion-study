// Renders scene.html at 4 sub-frames per output frame (shutter ~180deg) so ffmpeg can average them into real motion blur.
// Usage: node render.mjs <outDir>   -> <outDir>/00000.jpg ... and events.json
import puppeteer from 'puppeteer-core';
import {mkdirSync, writeFileSync} from 'fs';
const FPS = 30, DUR = 45, SUB = 4, SHUTTER = 0.5;
const out = process.argv[2];
mkdirSync(out, {recursive: true});
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  defaultViewport: {width: 1920, height: 1080},
});
const url = 'file://' + process.cwd() + '/scene.html';
const total = FPS * DUR * SUB;
const WORKERS = 4;
async function worker(w) {
  const p = await b.newPage();
  await p.goto(url);
  if (w === 0) writeFileSync(`${out}/events.json`, JSON.stringify(await p.evaluate(() => window.EVENTS)));
  for (let n = w; n < total; n += WORKERS) {
    const f = Math.floor(n / SUB), k = n % SUB;
    const t = (f + (k - (SUB - 1) / 2) * (SHUTTER / SUB)) / FPS;
    await p.evaluate(x => seek(x), Math.max(0, t));
    await p.screenshot({path: `${out}/${String(n).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92});
  }
}
await Promise.all(Array.from({length: WORKERS}, (_, w) => worker(w)));
await b.close();
console.log('subframes', total);
