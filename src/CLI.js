/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import fs from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
import Pipeline from './Pipeline';

type Options = {
  [flags: string]: string | {
    defaultValue?: mixed,
    description: string,
    parser?: mixed,
  },
};

export default class CLI {
  app: Command;
  package: Object;
  pipeline: Pipeline;

  constructor(packagePath: string) {
    if (!packagePath) {
      throw new Error('Path to local `package.json` is required.');
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const { name, version, description } = pkg;

    this.app = new Command(name);
    this.package = pkg;
    this.pipeline = new Pipeline(name);

    // Auto-setup commander
    this.app
      .version(version)
      .description(description)
      .usage(`${name} [options]`);
  }

  options(options: Options): this {
    Object.keys({
      '-c, --config <path>': 'Path to configuration file',
      ...options,
    }).forEach((flags: string) => {
      const option = options[flags];

      if (typeof option === 'string') {
        this.app.option(flags, chalk.green(option));
      } else {
        this.app.option(
          flags,
          chalk.green(option.description),
          option.parser || option.defaultValue,
          option.defaultValue,
        );
      }
    });

    return this;
  }

  run() {
    this.app.parse(process.argv);
  }
}
