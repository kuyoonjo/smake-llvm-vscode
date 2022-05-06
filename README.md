# @smake/llvm

```js
// smake.js
const { Fn, Shell } = require('@smake/utils');

const target = 'armv7-unknown-linux-gnu';

const executable = new LLVM('executable', target);
executable.files = ['examples/src/main.c'];

const static = new LLVM('static', target);
static.type = 'static';
static.files = ['examples/src/lib.cpp'];

const static_executable = new LLVM('static_executable', target);
static_executable.files = ['examples/src/libmain.cpp'];
static_executable.libs.push(static);

const shared = new LLVM('shared', target);
shared.type = 'shared';
shared.files = ['examples/src/dll.cpp'];

const shared_executable = new LLVM('shared_executable', target);
shared_executable.files = ['examples/src/dllmain.cpp'];
shared_executable.libs.push(shared);

module.exports = [
  executable,
  static,
  static_executable,
  shared,
  shared_executable,
];
```