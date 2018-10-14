/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { Argv } from 'yargs';
import Tool from './Tool';

export default class CLI {
  static registerGlobalOptions(app: Argv, tool: Tool) {
    app
      .option('config', {
        default: '',
        description: tool.msg('app:cliOptionConfig'),
        string: true,
      })
      .option('debug', {
        boolean: true,
        default: false,
        description: tool.msg('app:cliOptionDebug'),
      })
      .option('locale', {
        default: '',
        description: tool.msg('app:cliOptionLocale'),
        string: true,
      })
      .option('output', {
        default: 3,
        description: tool.msg('app:cliOptionOutput'),
        number: true,
      })
      .option('silent', {
        boolean: true,
        default: false,
        description: tool.msg('app:cliOptionSilent'),
      })
      .option('theme', {
        default: 'default',
        description: tool.msg('app:cliOptionTheme'),
        string: true,
      });
  }
}
