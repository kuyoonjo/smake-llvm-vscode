const build = require('./build');

module.exports = [
  ...build('aarch64-unknown-linux-gnu'),
  ...build('x86_64-unknown-linux-gnu'),
  ...build('armv7-unknown-linux-gnueabihf'),
  ...build('i686-unknown-linux-gnu'),
];