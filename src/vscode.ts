import { join } from "@smake/utils";
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { LLVM } from "./LLVM";

const compdb: any[] = [];
const compdbFilePath = 'compile_commands.json';

export function vscode(llvm: LLVM) {
  const t = llvm as any;
  t.vscode = async (opts: any, first: boolean, last: boolean) => {
    const cmds: any[] = await llvm.generateCommands(first, last);
    await cmds[0].command(opts);
    let cmd = `ninja -f ${llvm.ninjaFilePath} -t compdb`;
    const json = execSync(cmd).toString();
    const arr = JSON.parse(json);
    if (first) compdb.splice(0);
    compdb.splice(compdb.length, 0, ...arr);
    if (last)
      writeFileSync(
        compdbFilePath,
        JSON.stringify(compdb, null, 2)
      );
  };
}

async function ide(llvm: LLVM) {
  ideVscodeTasks(keys);
  ideVscodeLaunch(keys, targetsMap);
  console.log(colors.green('VSCode OK.'));
}

async function fileExists(p: string) {
  
}

async function ideVscodeTasks(keys: string[]) {
  const dir = '.vscode';
  const fp = join(dir, 'tasks.json');
  let json: {
    version: string;
    tasks: any[];
  };
  if (!existsSync(fp)) {
    mkdirSync(dir, { recursive: true });
    json = {
      version: '2.0.0',
      tasks: [],
    };
  } else {
    try {
      json = cj.parse(readFileSync(fp).toString());
    } catch {
      json = {
        version: '2.0.0',
        tasks: [],
      };
    }
  }

  for (const k of keys) {
    const label = 'Build release ' + k;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'node',
      args: ['node_modules/smake/lib/bin', 'build', k],
      group: 'build',
      options: {
        cwd: '${workspaceRoot}',
      },
    };
  }
  for (const k of keys) {
    const label = 'Build debug ' + k;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'node',
      args: ['node_modules/smake/lib/bin', 'build', '-d', k],
      group: 'test',
      options: {
        cwd: '${workspaceRoot}',
      },
    };
  }
  for (const k of keys) {
    const label = 'Build compdb ' + k;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'node',
      args: ['node_modules/smake/lib/bin', 'build', '-c', k],
      options: {
        cwd: '${workspaceRoot}',
      },
      problemMatcher: [],
    };
  }
  for (const k of keys) {
    const label = 'Clean ' + k;
    let i = json.tasks.findIndex((t) => t.label === label);
    if (!~i) i = json.tasks.length;
    json.tasks[i] = {
      label,
      type: 'shell',
      command: 'node',
      args: ['node_modules/smake/lib/bin', 'clean', k],
      options: {
        cwd: '${workspaceRoot}',
      },
      problemMatcher: [],
    };
  }
  writeFileSync(fp, JSON.stringify(json, null, 2));
}

function ideVscodeLaunch(keys: string[], targetsMap: any) {
  const dir = '.vscode';
  const fp = dir + '/launch.json';
  let json: {
    version: string;
    configurations: any[];
  };
  if (!existsSync(fp)) {
    mkdirSync(dir, { recursive: true });
    json = {
      version: '0.2.0',
      configurations: [],
    };
  } else {
    try {
      json = cj.parse(readFileSync(fp).toString());
    } catch {
      json = {
        version: '0.2.0',
        configurations: [],
      };
    }
  }

  for (const k of keys) {
    const obj = targetsMap[k];
    if (obj.type !== 'executable') continue;
    if (!(obj instanceof LLVM)) continue;
    const debugLabel = 'Build debug ' + k;
    const name = '(lldb) ' + k;
    let i = json.configurations.findIndex((t) => t.name === name);
    if (!~i) i = json.configurations.length;
    json.configurations[i] = {
      name,
      type: 'lldb',
      request: 'launch',
      program: obj.outputPath,
      args: [],
      stopAtEntry: false,
      cwd: '${workspaceRoot}',
      environment: [],
      console: 'integratedTerminal',
      preLaunchTask: debugLabel,
    };
  }

  writeFileSync(fp, JSON.stringify(json, null, 2));
}