import { LLVM } from "@smake/llvm";
import { execSync } from "child_process";
import { parse, stringify } from "comment-json";
import { readFile, stat } from "fs/promises";


export function vscode(llvm: LLVM) {
  const t = llvm as any;
  t.vscode = async (files: any[], opts: any, key: string) => {
    await compdb(files, opts, llvm);
    await vscodeTasks(files, key);
    await vscodeLaunch(files, key, llvm);
  };
}

const compdbFilePath = 'compile_commands.json';

async function compdb(files: any[], opts: any, llvm: LLVM) {
  const cmds: any[] = await llvm.generateCommands(false, false);
  await cmds[0].command(opts);
  let cmd = `ninja -f ${llvm.ninjaFilePath} -t compdb`;
  const json = execSync(cmd).toString();
  const arr = JSON.parse(json);
  let file = files.find(f => f.path === compdbFilePath);
  if (!file) {
    file = { path: compdbFilePath, content: '[]' };
    files.push(file);
  }
  const dbs = JSON.parse(file.content);
  dbs.splice(dbs.length, 0, ...arr);
  file.content = JSON.stringify(dbs, null, 2);
}

async function fileExists(p: string) {
  try {
    const st = await stat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

const vscodeTasksFilePath = '.vscode/tasks.json';

async function vscodeTasks(files: any[], key: string) {
  let file = files.find(f => f.path === vscodeTasksFilePath);
  if (!file) {
    if (await fileExists(vscodeTasksFilePath)) {
      try {
        const content = (await readFile(vscodeTasksFilePath)).toString();
        file = {
          path: vscodeTasksFilePath, content,
        };
      } catch { }
    }

    if (!file) {
      file = {
        path: vscodeTasksFilePath, content: JSON.stringify({
          version: '2.0.0',
          tasks: [],
        })
      };
    }
    files.push(file);
  }

  const json: {
    version: string;
    tasks: any[];
  } = parse(file.content) as any;

  if (true) {
    const label = 'Build release ' + key;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'smake',
      args: ['build', key],
      group: 'build',
      options: {
        cwd: '${workspaceRoot}',
      },
    };
  }
  if (true) {
    const label = 'Build debug ' + key;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'smake',
      args: ['build', '-d', key],
      group: 'test',
      options: {
        cwd: '${workspaceRoot}',
      },
    };
  }
  if (true) {
    const label = 'Clean ' + key;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'smake',
      args: ['clean', key],
      options: {
        cwd: '${workspaceRoot}',
      },
      problemMatcher: [],
    };
  }
  file.content = stringify(json, null, 2);
}

const vscodeLaunchFilePath = '.vscode/launch.json';

async function vscodeLaunch(files: any[], key: string, llvm: LLVM) {
  let file = files.find(f => f.path === vscodeLaunchFilePath);
  if (!file) {
    if (await fileExists(vscodeLaunchFilePath)) {
      try {
        const content = (await readFile(vscodeLaunchFilePath)).toString();
        file = {
          path: vscodeLaunchFilePath, content,
        };
      } catch { }
    }

    if (!file) {
      file = {
        path: vscodeLaunchFilePath, content: JSON.stringify({
          version: '0.2.0',
          configurations: [],
        })
      };
    }
    files.push(file);
  }

  const json: {
    version: string;
    configurations: any[];
  } = parse(file.content) as any;

  if (llvm.type === 'executable') {
    const debugLabel = 'Build debug ' + key;
    const name = '(lldb) ' + key;
    let i = json.configurations.findIndex((t) => t.name === name);
    if (!~i) i = json.configurations.length;
    json.configurations[i] = {
      name,
      type: 'lldb',
      request: 'launch',
      program: llvm.outputPath,
      args: [],
      stopAtEntry: false,
      cwd: '${workspaceRoot}',
      environment: [],
      console: 'integratedTerminal',
      preLaunchTask: debugLabel,
    };
  }

  file.content = stringify(json, null, 2);
}