import path from 'path';
import { Arguments } from 'yargs-parser';
import Console from './Console';
import Context from './Context';
import Plugin from './Plugin';
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

export function stubArgs(fields: object = {}): Arguments {
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

export function mockTool(options?: Partial<ToolOptions>): TestTool {
  const tool: TestTool = new Tool({
    appName: 'test-boost',
    // Match fixtures path
    appPath: path.join(process.cwd(), 'tests/__fixtures__/app'),
    ...options,
  });

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
  execute(context: Ctx, value: unknown) {
    return Promise.resolve(value);
  }
}

export function mockRoutine<Ctx extends Context>(
  tool: Tool<any, any>,
  key: string = 'key',
  title: string = 'Title',
): Routine<Ctx, TestTool> {
  const routine = new MockRoutine<Ctx>(key, title);

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
