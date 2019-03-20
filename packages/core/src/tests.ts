import Console from './Console';
import Context from './Context';
import Routine from './Routine';
import Task, { TaskAction } from './Task';
import Tool, { ToolConfig, ToolOptions, ToolPluginRegistry } from './Tool';
import { Debugger, PackageConfig, PluginSetting } from './types';

export interface TestToolPlugins extends ToolPluginRegistry {
  plugin: Plugin;
}

export interface TestToolConfig extends ToolConfig {
  plugins: PluginSetting<Plugin>;
}

export type TestTool = Tool<TestToolPlugins, TestToolConfig>;

export function stubArgs(fields: object = {}): any {
  return {
    $0: '',
    _: [],
    ...fields,
  };
}

export function stubPackageJson(fields: Partial<PackageConfig> = {}): PackageConfig {
  return {
    name: 'test-boost',
    version: '0.0.0',
    ...fields,
  };
}

export function stubToolConfig(config: Partial<TestToolConfig> = {}): TestToolConfig {
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
  };
}

export function mockDebugger(): Debugger {
  const debug = jest.fn();

  // @ts-ignore Allow property access
  debug.invariant = jest.fn();

  return debug as any;
}

export function mockTool(options: ToolOptions): TestTool {
  const tool: TestTool = new Tool(options);

  tool.registerPlugin('plugin', Plugin);

  // Stub out standard objects
  tool.args = stubArgs();
  tool.config = stubToolConfig();
  tool.package = stubPackageJson();

  // Stub out methods
  tool.debug = mockDebugger();
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

export class MockRoutine<Ctx extends Context> extends Routine<Ctx, TestTool> {
  execute(context: Ctx, value: any) {
    return Promise.resolve(value);
  }
}

export function mockRoutine<Ctx extends Context>(
  tool: Tool<any, any>,
  key: string = 'key',
  title: string = 'Title',
): any {
  const routine = new MockRoutine<Ctx>(key, title);

  routine.tool = tool;
  routine.debug = mockDebugger();

  return routine;
}

export function mockTask<Ctx extends Context>(
  action: TaskAction<Ctx> | null = null,
  title: string = 'Title',
): Task<Ctx> {
  return new Task(title, action || jest.fn());
}
