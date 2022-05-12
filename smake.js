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
  const ts = builds.filter(t => t.target.includes('x86_64-pc-windows-msvc'));
  ts.forEach(vscode);
} else if (process.platform === 'linux') {
  const ts = builds.filter(t => t.target.includes('x86_64-unknown-linux'));
  ts.forEach(vscode);
}

module.exports = builds;
