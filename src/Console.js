/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Renderer from './Renderer';

export default class Console {
  renderer: Renderer;

  constructor(renderer: Renderer) {
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
}
