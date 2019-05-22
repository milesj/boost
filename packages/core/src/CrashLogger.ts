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
}
