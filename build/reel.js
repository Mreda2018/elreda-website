// Renders design-src/reel-services.html to a 1080x1920 / 30 fps MP4 for Instagram Reels.
// From the repo root:  python3 -m http.server 8899 &   then
//   node build/reel.js --stills 1.6,4.5,9.2,16.9,22.5   (preview frames to /tmp/reel-stills)
//   node build/reel.js OUT.mp4                            (full render)
// Each scene is encoded to its own file (piped JPEG frames -> libx264) and the files are
// joined with the concat demuxer. Transitions live inside the timeline, so cuts are clean.
const {chromium} = require('playwright');
const {spawn, execFileSync} = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const exe = fs.existsSync('/opt/pw-browsers/chromium') ? {executablePath: '/opt/pw-browsers/chromium'} : {};
const FPS = 30, SRC = 'http://localhost:8899/design-src/reel-services.html';
const SCENES = [[0, 3.2], [3.2, 15.2], [15.2, 19.4], [19.4, 24.5]];

(async () => {
  const b = await chromium.launch(exe);
  const pg = await (await b.newContext({viewport: {width: 1080, height: 1920}, deviceScaleFactor: 1})).newPage();
  await pg.goto(SRC, {waitUntil: 'networkidle'});
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  const si = process.argv.indexOf('--stills');
  if (si > -1) {
    fs.mkdirSync('/tmp/reel-stills', {recursive: true});
    for (const t of process.argv[si + 1].split(',').map(Number)) {
      await pg.evaluate(t => seek(t), t);
      await pg.screenshot({path: `/tmp/reel-stills/t${t}.jpg`, type: 'jpeg', quality: 92});
      console.log('still', t);
    }
    return b.close();
  }
  const out = path.resolve(process.argv[2] || 'reel.mp4');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reel-'));
  const parts = [];
  for (const [k, [a, z]] of SCENES.entries()) {
    const part = path.join(tmp, `s${k}.mp4`), work = path.join(tmp, `s${k}.tmp.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', work]);
    const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
    const n = Math.round((z - a) * FPS);
    for (let f = 0; f < n; f++) {
      await pg.evaluate(t => seek(t), a + f / FPS);
      const buf = await pg.screenshot({type: 'jpeg', quality: 92});
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await done; fs.renameSync(work, part); parts.push(part);
    console.log(`scene ${k + 1}/${SCENES.length}: ${n} frames`);
  }
  const list = path.join(tmp, 'list.txt');
  fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  // silent stereo track so every player and Instagram treat it as a normal video; add music in the app
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000', '-shortest',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]);
  console.log('wrote', out);
  await b.close();
})();
