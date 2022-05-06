const { vscode } = require('./lib');

const builds = [
  ...require('./examples/buildDarwin'),
  ...require('./examples/buildLinux'),
  ...require('./examples/buildWin32'),
];

if (process.platform === 'darwin') {
  const ts = builds.filter(t => t.target.includes('apple'));
  ts.forEach(vscode);
} else if (process.platform === 'win32') {

} else if (process.platform === 'linux') {

}

(async () => {
  let ci = 0;
  const ts = builds.filter(t => t.vscode);
  for (const t of ts) {
    await t.vscode({}, !ci, ci === ts.length - 1);
    ++ci;
  }
})();
