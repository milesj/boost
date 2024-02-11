import type { Blueprint, Schemas } from '@boost/common/optimal';
import {
	DEFAULT_PRIORITY,
	type Pluggable,
	Plugin,
	Registry,
	type RegistryOptions,
} from '../../src';

export interface Renderable extends Pluggable {
	render: () => string;
}

export class Renderer extends Plugin<unknown, { value: string }> implements Renderable {
	readonly name = '';

	priority = DEFAULT_PRIORITY;

	blueprint({ string }: Schemas): Blueprint<{ value: string }> {
		return {
			value: string(),
		};
	}

	render() {
		return 'test';
	}
}

export function createRendererRegistry(options?: Partial<RegistryOptions<Renderable>>) {
	return new Registry<Renderable>('boost-test', 'renderer', {
		validate(plugin) {
			if (typeof plugin.render !== 'function') {
				throw new TypeError('Renderer requires a `render()` method.');
			}
		},
		...options,
	});
}
