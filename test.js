const { writeFile, mkdir } = require('fs/promises');
const { dirname } = require('path');
const builds = require('./smake');

(async () => {
  const files = [];
  const ts = builds.filter(t => t.vscode);
  for (const t of ts) {
    await t.vscode(files, { debug: true }, t, builds);
  }
  for (const f of files) {
    await mkdir(dirname(f.path), { recursive: true });
    await writeFile(f.path, f.content);
  }
  console.log('VSCode OK.');
})();