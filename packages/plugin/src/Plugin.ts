import { Contract } from '@boost/common';
import { Pluggable } from './types';

export abstract class Plugin<T = unknown, Options extends object = {}>
	extends Contract<Options>
	implements Pluggable<T> {
	name = '';

	startup(tool: T) {}

	shutdown(tool: T) {}
}
