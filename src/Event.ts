/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { EventNextHandler } from './types';

export default class Event {
  name: string;

  next: EventNextHandler | null = null;

  stopped: boolean = false;

  time: number;

  value: any;

  constructor(name: string, value: any = null) {
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
