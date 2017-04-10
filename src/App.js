/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable global-require, import/no-dynamic-require */

import path from 'path';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import Vorpal from 'vorpal';
import Command from './Command';

import type { AppConfig, GlobalConfig } from './types';

const CWD = process.cwd();

export default class App {
  config: AppConfig;
  global: GlobalConfig;
  id: string;
  package: Object;
  title: string;
  vorpal: Vorpal;

  constructor(id: string, config: AppConfig = {}) {
    if (!id || typeof id !== 'string') {
      throw new Error('A unique ID is required for Boost applications.');
    }

    this.id = id;
    this.config = config;

    // Setup global configuration
    this.global = {
      command: {
        name: '',
        args: [],
      },
      config: this.loadConfig(),
      package: this.loadPackage(),
    };

    // Setup vorpal
    this.vorpal = new Vorpal();
  }

  /**
   * Register an executable command using a callback.
   */
  command(format: string, callback: (Command) => void): this {
    if (typeof callback !== 'function') {
      throw new Error('A callback function is required when creating commands.');
    }

    callback(new Command(this.vorpal.command(format), this.global));

    return this;
  }

  /**
   * Attempt to load a local configuration file found in the
   * current working directories config/ folder.
   */
  loadConfig(): Object {
    const filePath = `config/${this.id}.js`;
    let config = {};

    try {
      // $FlowIgnore
      config = require(path.join(CWD, filePath));
    } catch (error) {
      config = {};
    }

    if (!isObject(config)) {
      throw new Error(`Local configuration file "${filePath}" must return an object.`);
    }

    return merge({}, this.config.defaultConfig || {}, config);
  }

  /**
   * Attempt to load `package.json` from the current working directory.
   */
  loadPackage(): Object {
    try {
      // $FlowIgnore
      return require(path.join(CWD, 'package.json'));
    } catch (error) {
      throw new Error(
        'Local "package.json" could not be found. ' +
        'Please run this command in your project\'s root.',
      );
    }
  }

  run(): this {
    this.vorpal
      .delimiter(`${this.id}$ `)
      // .show()
      .parse(process.argv);

    return this;
  }
}
