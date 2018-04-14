/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emitter, { EmitterInterface } from './Emitter';
import { ReporterInterface } from './Reporter';

export interface ConsoleOptions {}

export interface ConsoleInterface extends EmitterInterface {
  options: ConsoleOptions;
  reporter: ReporterInterface;
  // error(message: string, ...args: any[]): void;
  // exit(message: string | Error | null, code: number): void;
  // log(message: string, ...args: any[]): void;
  // start(tasks?: TaskInterface[]): void;
  // stop(): void;
  // update(): void;
}

export default class Console extends Emitter {
  // constructor(parameters) {}
}
