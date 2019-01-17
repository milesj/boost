/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-magic-numbers */

import fs from 'fs-extra';
import util from 'util';
import path from 'path';
import execa from 'execa';
import Tool from './Tool';

export default class CrashLogger {
  contents: string = '';

  logPath: string;

  // istanbul ignore next
  constructor(tool: Tool<any>) {
    const { config, console: cli, options } = tool;

    this.logPath = path.join(options.root, `${options.appName}-error.log`);

    this.add('Node', process.version.slice(1));
    this.add('NPM', String(execa.shellSync('npm --version').stdout));

    try {
      this.add('Yarn', String(execa.shellSync('yarn --version').stdout));
    } catch {
      this.add('Yarn', '(Not installed)');
    }

    this.addTitle('Process');
    this.add('ID', process.pid);
    this.add('Title', process.title);
    this.add('Timestamp', new Date().toISOString());
    this.add('CWD', process.cwd());
    this.add('ARGV', process.argv.join('\n  '));

    this.addTitle('Platform');
    this.add('OS', process.platform);
    this.add('Architecture', process.arch);
    this.add('Uptime (sec)', process.uptime());
    this.add(
      'Memory usage',
      `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
    );

    if (process.platform !== 'win32') {
      this.add('Group ID', process.getgid());
      this.add('User ID', process.getuid());
    }

    this.addTitle('Tool Instance');
    this.add('App name', options.appName);
    this.add('App path', options.appPath);
    this.add('Plugin types', Object.keys(tool.getRegisteredPlugins()).join(', '));
    this.add('Scoped package', options.scoped ? 'Yes' : 'No');
    this.add('Root', options.root);
    this.add('Config name', options.configName);
    this.add('Package path', path.join(options.root, 'package.json'));
    this.add('Workspaces root', options.workspaceRoot || '(Not enabled)');
    this.add(
      'Extending configs',
      config.extends.length > 0 ? util.inspect(config.extends) : '(Not extending)',
    );

    this.addTitle('Console Instance');
    this.add('Logs', cli.logs.length > 0 ? cli.logs.join('\n  ') : '(No logs)');
    this.add(
      'Error logs',
      cli.errorLogs.length > 0 ? cli.errorLogs.join('\n  ') : '(No error logs)',
    );
  }

  add(label: string, message: string | number) {
    this.contents += `${label}:\n`;
    this.contents += `  ${message}\n`;
  }

  addTitle(title: string) {
    this.contents += `\n\n${title.toUpperCase()}\n`;
    this.contents += `${'='.repeat(title.length)}\n\n`;
  }

  log(error: Error) {
    this.addTitle('Stack Trace');
    this.contents += error.stack;

    this.addTitle('Environment');

    Object.keys(process.env).forEach(key => {
      this.add(key, process.env[key]!);
    });

    fs.writeFileSync(this.logPath, this.contents, 'utf8');
  }
}
