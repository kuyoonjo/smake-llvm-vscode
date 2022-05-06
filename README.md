# @smake/llvm-vscode

```js
// smake.js
const { LLVM } = require('@smake/llvm');
const { vscode } = require('@smake/llvm-vscode');

const target = 'x86_64-unknown-linux-gnu';

const executable = new LLVM('executable', target);
executable.files = ['examples/src/main.c'];

vscode(executable);

module.exports = [executable];
```