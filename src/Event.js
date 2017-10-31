/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { EventNextHandler } from './types';

export default class Event {
  name: string;

  next: ?EventNextHandler = null;

  stopped: boolean = false;

  time: number;

  value: *;

  constructor(name: string, value: * = null) {
    if (!name || typeof name !== 'string') {
      throw new Error('A valid event name is required.');
    }

    this.name = name;
    this.time = Date.now();
    this.value = value;
  }

  stop() {
    this.stopped = true;
  }
}
