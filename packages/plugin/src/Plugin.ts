import { Contract } from '@boost/common';
import { Pluggable } from './types';

export default abstract class Plugin<T = unknown, Options extends object = {}>
  extends Contract<Options>
  implements Pluggable<T> {
  startup(tool: T) {}

  shutdown(tool: T) {}
}
