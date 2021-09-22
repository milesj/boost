/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import * as ArgDecorators from './decorators';
import * as ArgInitializers from './initializers';

export * from './CLIError';
export * from './Command';
export * from './constants';
export { Config } from './decorators/Config';
export * from './helpers';
export * from './middleware';
export * from './Program';
export * from './types';

export const Arg = {
	...ArgDecorators,
	...ArgInitializers,
};
