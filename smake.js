const builds = [
  ...require('./examples/buildDarwin'),
  ...require('./examples/buildLinux'),
  ...require('./examples/buildWin32'),
];

module.exports = builds;
