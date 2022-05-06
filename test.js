const { writeFile, mkdir } = require('fs/promises');
const { dirname } = require('path');
const { vscode } = require('./lib');
const builds = require('./smake');

if (process.platform === 'darwin') {
    const ts = builds.filter(t => t.target.includes('apple'));
    ts.forEach(vscode);
  } else if (process.platform === 'win32') {
  
  } else if (process.platform === 'linux') {
    const ts = builds.filter(t => t.target.includes('x86_64-unknown-linux'));
    ts.forEach(vscode);
  }
  
  function findKey(t, ts, prefix = '') {
    for (const _t of ts) {
      if (t === _t) return prefix + t.id;
      else if (_t.targets) {
        const k = findKey(t, _t.targets, prefix + _t.name + ':');
        if (k) return k;
      }
    }
    return null;
  }
  
  (async () => {
    const files = [];
    const ts = builds.filter(t => t.vscode);
    for (const t of ts) {
      const key = findKey(t, builds);
      await t.vscode(files, { debug: true }, key);
    }
    for (const f of files) {
      await mkdir(dirname(f.path), { recursive: true });
      await writeFile(f.path, f.content);
    }
    console.log('VSCode OK.');
  })();