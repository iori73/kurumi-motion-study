// Renders scene.html (window.seek(t)) to numbered JPEG frames. Usage: node render.mjs <outDir>
import puppeteer from 'puppeteer-core';
import {mkdirSync} from 'fs';
const FPS = 30, DUR = 20, N = FPS * DUR;
const out = process.argv[2];
mkdirSync(out, {recursive: true});
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  defaultViewport: {width: 1920, height: 1080},
});
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/scene.html');
for (let i = 0; i < N; i++) {
  await p.evaluate(t => seek(t), i / FPS);
  await p.screenshot({path: `${out}/${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 95});
}
await b.close();
console.log('frames', N);
