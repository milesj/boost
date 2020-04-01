import { PrimitiveType } from '@boost/args';
import Command from '../Command';
import Config from '../decorators/Config';
import {
  CommandPath,
  GlobalOptions,
  ProxyCommandConfig,
  ProxyCommandRunner,
  RunResult,
} from '../types';
import { CACHE_OPTIONS, CACHE_PARAMS } from '../constants';

export default function createProxyCommand<O extends GlobalOptions, P extends PrimitiveType[]>(
  path: CommandPath,
  { description, options, params, ...config }: ProxyCommandConfig<O, P>,
  runner: ProxyCommandRunner<O, P>,
): Command<O, P> {
  @Config(path, description, config)
  class ProxyCommand extends Command<O, P> {
    run(): RunResult | Promise<RunResult> {
      return runner.call(this, this[CACHE_OPTIONS] as O, this[CACHE_PARAMS] as P, this.rest);
    }
  }

  if (options !== undefined) {
    ProxyCommand.options = options;
  }

  if (params !== undefined) {
    ProxyCommand.params = params;
  }

  return new ProxyCommand();
}
