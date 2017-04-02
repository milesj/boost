/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import promise from 'promise.prototype.finally';
// import CLI from './CLI';
import Pipeline from './Pipeline';
import Routine from './Routine';

promise.shim();

export { Pipeline, Routine };
// export default CLI;
