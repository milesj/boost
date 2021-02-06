import { PrimitiveType } from '@boost/args';
import Command from '../Command';
import { INTERNAL_OPTIONS, INTERNAL_PARAMS } from '../constants';
import Config from '../decorators/Config';
import {
  CommandPath,
  GlobalOptions,
  ProxyCommandConfig,
  ProxyCommandRunner,
  RunResult,
} from '../types';

export default function createProxyCommand<O extends GlobalOptions, P extends PrimitiveType[]>(
  path: CommandPath,
  { description, options, params, ...config }: ProxyCommandConfig<O, P>,
  runner: ProxyCommandRunner<O, P>,
): Command<O, P> {
  @Config(path, description, config)
  class ProxyCommand extends Command<O, P> {
    run(): Promise<RunResult> | RunResult {
      return runner.call(this, this[INTERNAL_OPTIONS]!, this[INTERNAL_PARAMS]!, this.rest);
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
