/* eslint-disable sort-keys */

import chalk from 'chalk';

export default {
  // States
  fail: chalk.red,
  mute: chalk.gray,
  pass: chalk.green,
  // Types
  filePath: chalk.cyan,
  moduleName: chalk.yellow,
  pluginType: chalk.magenta,
  projectName: chalk.blue,
};
