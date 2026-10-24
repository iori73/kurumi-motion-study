// Screenshots scene.html at given times (seconds). Usage: node snap.mjs <outDir> <t1> <t2> ...
import puppeteer from 'puppeteer-core';
import {mkdirSync} from 'fs';
const [out, ...ts] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  defaultViewport: {width: 1920, height: 1080},
});
const p = await b.newPage();
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto('file://' + process.cwd() + '/scene.html');
for (const t of ts) {
  await p.evaluate(x => seek(x), parseFloat(t));
  await p.screenshot({path: `${out}/snap_${t}.jpg`, type: 'jpeg', quality: 90});
}
await b.close();
