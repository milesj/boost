import { Contract } from '@boost/common';
import type { Pluggable } from './types';

export abstract class Plugin<T = unknown, Options extends object = {}>
	extends Contract<Options>
	implements Pluggable<T>
{
	abstract name: string;

	startup(tool: T) {}

	shutdown(tool: T) {}
}
