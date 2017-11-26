/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import chalk from 'chalk';
import Renderer from './Renderer';

import type { TasksLoader } from './types';

// const INTERRUPT_CODE: number = 130;

export default class Console<Tr: Renderer<*>> {
  debugs: string[] = [];

  debugGroups: string[] = [];

  errors: string[] = [];

  logs: string[] = [];

  renderer: Tr;

  constructor(renderer: Tr) {
    this.renderer = renderer;

    // https://github.com/facebook/flow/blob/dd0603e9d8c9d5fb99a40f0b179a4d6a2b9e66b7/tsrc/main.js
    // process.on('SIGINT', () => {
    //   this.emit('exit');
    //
    //   process.exitCode = INTERRUPT_CODE;
    // });
    //
    // process.on('uncaughtException', () => {});
    //
    // process.on('unhandledRejection', () => {});
  }

  /**
   * Add a message to the debug log.
   */
  debug(message: string) {
    this.debugs.push(`${chalk.blue('[debug]')}${this.renderer.indent(this.debugGroups.length)} ${message}`);
  }

  /**
   * Display the final output to stdout.
   */
  displayOutput() {
    // TODO
  }

  /**
   * Display an error to stderr.
   */
  displayError(error?: ?Error = null) {
    // TODO
  }

  /**
   * Add a message to the error log.
   */
  error(message: string) {
    this.errors.push(message);
  }

  /**
   * Add a message to the output log.
   */
  log(message: string) {
    this.logs.push(message);
  }

  /**
   * Start a new console and begin rendering.
   */
  start(loader: TasksLoader<*>) {
    this.renderer.start(loader);
  }

  /**
   * Start a debug capturing group, which will indent all incoming debug messages.
   */
  startDebugGroup(group: string) {
    this.debug(chalk.gray(`[${group}]`));
    this.debugGroups.push(group);
  }

  /**
   * Stop rendering and end the console.
   */
  stop() {
    this.renderer.stop();
  }

  /**
   * End the current debug capturing group.
   */
  stopDebugGroup() {
    this.debugGroups.pop();
  }

  /**
   * Force a rendering update.
   */
  update() {
    this.renderer.update();
  }
}
