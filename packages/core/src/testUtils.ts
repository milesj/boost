import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Arguments } from 'yargs';
import { mockDebugger } from '@boost/debug/lib/testing';
import Console from './Console';
import Context from './Context';
import Plugin from './Plugin';
import Routine from './Routine';
import Task, { TaskAction } from './Task';
import Tool, { ToolConfig, ToolOptions, ToolPluginRegistry } from './Tool';
import { PackageConfig, PluginSetting } from './types';

// TODO Remove in 2.0
export { mockDebugger };

export interface TestToolPlugins extends ToolPluginRegistry {
  plugin: Plugin;
}

export interface TestToolConfig extends ToolConfig {
  plugins: PluginSetting<Plugin>;
}

export type TestTool = Tool<TestToolPlugins, TestToolConfig>;

export function stubArgs<T extends object = {}>(fields?: Partial<T>): Arguments<T> {
  // @ts-ignore
  return {
    $0: '',
    _: [],
    ...fields,
  };
}

export function stubPackageJson<T extends object = {}>(
  fields?: Partial<PackageConfig & T>,
): PackageConfig & T {
  // @ts-ignore
  return {
    name: 'test-boost',
    version: '0.0.0',
    ...fields,
  };
}

export function stubToolConfig<T extends ToolConfig = TestToolConfig>(config?: Partial<T>): T {
  return {
    debug: false,
    extends: [],
    locale: '',
    output: 2,
    plugins: [],
    reporters: [],
    settings: {},
    silent: false,
    theme: 'default',
    ...config,
  } as any;
}

export function mockTool<
  P extends ToolPluginRegistry = TestToolPlugins,
  C extends ToolConfig = TestToolConfig
>(options?: Partial<ToolOptions>, config?: Partial<C>, injectPlugin: boolean = true): Tool<P, C> {
  const tool = new Tool<P, C>({
    appName: 'test-boost',
    // Match fixtures path
    appPath: path.join(process.cwd(), 'tests/__fixtures__/app'),
    ...options,
  });

  // Register default plugins
  if (injectPlugin) {
    // @ts-ignore Ignore this for convenience
    tool.registerPlugin('plugin', Plugin);
  }

  // Stub out standard objects
  tool.args = stubArgs();
  tool.config = stubToolConfig(config);
  tool.package = stubPackageJson();

  // Stub out methods
  tool.debug = mockDebugger();

  // TODO Remove in 2.0
  // @ts-ignore
  tool.createDebugger = mockDebugger;

  // @ts-ignore Allow private access to avoid loaders
  tool.initialized = true;

  return tool;
}

export function mockConsole(tool: Tool<any, any>): Console {
  const cli = new Console(tool, {
    stderr: jest.fn(),
    stdout: jest.fn(),
  });

  cli.err = jest.fn();
  cli.out = jest.fn();

  return cli;
}

export class MockRoutine<Ctx extends Context, T extends Tool<any, any> = TestTool> extends Routine<
  Ctx,
  T
> {
  execute(context: Ctx, value: unknown) {
    return Promise.resolve(value);
  }
}

export function mockRoutine<Ctx extends Context, T extends Tool<any, any> = TestTool>(
  tool: T,
  key: string = 'key',
  title: string = 'Title',
): Routine<Ctx, T> {
  const routine = new MockRoutine<Ctx, T>(key, title);

  routine.tool = tool;
  routine.debug = mockDebugger();

  return routine;
}

export function mockTask<Ctx extends Context>(
  action: TaskAction<Ctx> | null = null,
  title: string = 'Description',
): Task<Ctx> {
  return new Task(title, action || jest.fn());
}
