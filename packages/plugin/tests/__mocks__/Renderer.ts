import { Predicates } from '@boost/common';
import { Manager, Pluggable, Plugin, DEFAULT_PRIORITY, ManagerOptions } from '../../src';

export interface Renderable extends Pluggable {
  render(): string;
}

export class Renderer extends Plugin<unknown, { value: string }> implements Renderable {
  name = '';

  priority = DEFAULT_PRIORITY;

  blueprint({ string }: Predicates) {
    return {
      value: string(),
    };
  }

  render() {
    return 'test';
  }
}

export function createRendererManager(options?: ManagerOptions<Renderable>) {
  return new Manager<Renderable>('boost-test', 'renderer', {
    validate(plugin) {
      if (typeof plugin.render !== 'function') {
        throw new TypeError('Renderer requires a `render()` method.');
      }
    },
    ...options,
  });
}
