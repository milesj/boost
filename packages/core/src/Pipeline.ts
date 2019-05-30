import exit from 'exit';
import path from 'path';
import util from 'util';
import { Blueprint, Predicates } from 'optimal';
import { instanceOf } from '@boost/common';
import { CrashReporter } from '@boost/debug';
import Context from './Context';
import ExitError from './ExitError';
import Routine from './Routine';
import CoreTool from './Tool';

export interface PipelineOptions {
  exit?: (code: number) => void;
}

export default class Pipeline<Ctx extends Context, Tool extends CoreTool<any>> extends Routine<
  Ctx,
  Tool,
  PipelineOptions
> {
  constructor(tool: Tool, context: Ctx, options?: PipelineOptions) {
    super('root', 'Pipeline', options);

    if (instanceOf(tool, CoreTool)) {
      tool.initialize();
    } else {
      throw new TypeError('A `Tool` instance is required to operate the pipeline.');
    }

    this.tool = tool;
    this.tool.debug('Instantiating pipeline');

    // Child routines should start at 0
    this.metadata.depth = -1;

    this.setContext(context);
  }

  blueprint({ func }: Predicates): Blueprint<Required<PipelineOptions>> {
    return {
      exit: func(exit).notNullable(),
    };
  }

  /**
   * Execute all routines in order.
   */
  run<T>(initialValue?: T): Promise<any> {
    const { console: cli } = this.tool;

    this.tool.debug('Running pipeline');

    cli.start([Array.from(this.routines), initialValue]);

    return this.serializeRoutines(initialValue)
      .then(result => {
        cli.stop();

        process.exitCode = 0;

        return result;
      })
      .catch(error => {
        cli.stop(error);

        this.reportCrash(error);

        if (instanceOf(error, ExitError)) {
          this.options.exit(error.code);
        } else {
          this.options.exit(1);
        }

        return error;
      });
  }

  /**
   * Report the pipeline failure by writing a crash log.
   */
  reportCrash(error: Error) {
    const { config, options } = this.tool;
    const reporter = new CrashReporter()
      .reportBinaries()
      .reportProcess()
      .reportSystem();

    reporter
      .addSection('Tool Instance')
      .add('App name', options.appName)
      .add('App path', options.appPath)
      .add('Plugin types', Object.keys(this.tool.getRegisteredPlugins()).join(', '))
      .add('Scoped package', options.scoped ? 'Yes' : 'No')
      .add('Root', options.root)
      .add('Config name', options.configName)
      .add('Package path', path.join(options.root, 'package.json'))
      .add('Workspaces root', options.workspaceRoot || '(Not enabled)')
      .add(
        'Extending configs',
        config.extends.length > 0 ? util.inspect(config.extends) : '(Not extending)',
      );

    reporter
      .reportLanguages()
      .reportStackTrace(error)
      .reportEnvVars()
      .write(path.join(options.root, `${options.appName}-error.log`));
  }
}
