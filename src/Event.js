/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Result } from './types';

export default class Event {
  name: string;
  stopped: boolean = false;
  time: number;
  value: Result;

  constructor(name: string, value: Result = null) {
    if (!name || typeof name !== 'string') {
      throw new Error('A valid event name is required.');

    } else if (typeof value === 'undefined') {
      throw new Error(`A valid initial value is required for ${name}, found undefined.`);
    }

    this.name = name;
    this.time = Date.now();
    this.value = value;
  }

  stop() {
    this.stopped = true;
  }
}
