const build = require('./build');

module.exports = [
  ...build('x86_64-pc-windows-msvc'),
  ...build('i686-pc-windows-msvc'),
  ...build('aarch64-pc-windows-msvc'),
  ...build('arm-pc-windows-msvc'),
];