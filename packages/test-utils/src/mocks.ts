/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  Console,
  Debugger,
  Plugin,
  Routine,
  Task,
  TaskAction,
  Tool,
  ToolOptions,
} from '@boost/core';
import { stubArgs, stubPackageJson, stubToolConfig } from './stubs';
import { TestTool, TestToolConfig, TestPluginRegistry } from './types';

export function mockDebugger(): Debugger {
  const debug = jest.fn();

  // @ts-ignore Allow property access
  debug.invariant = jest.fn();

  return debug as any;
}

export function mockTool(options?: Partial<ToolOptions>): any {
  const tool = new Tool<TestPluginRegistry, TestToolConfig>({
    appName: 'test-boost',
    appPath: __dirname,
    ...options,
  });

  tool.registerPlugin('plugin', Plugin);

  // Stub out standard objects
  tool.args = stubArgs();
  tool.config = stubToolConfig();
  tool.package = stubPackageJson();

  // @ts-ignore Allow private access and avoid loaders
  tool.initialized = true;

  return tool;
}

export function mockConsole(tool: Tool<any, any>): any {
  const cli = new Console(tool, {
    stderr: jest.fn(),
    stdout: jest.fn(),
  });

  cli.err = jest.fn();
  cli.out = jest.fn();

  return cli;
}

export function mockRoutine(
  tool: Tool<any, any>,
  key: string = 'key',
  title: string = 'Title',
): any {
  const routine = new Routine<any, TestTool>(key, title);

  routine.tool = tool;
  routine.debug = mockDebugger();
  routine.action = (context, value) => Promise.resolve(value); // Avoid execute exception
  routine.execute = routine.action;

  return routine;
}

export function mockTask(action: TaskAction<any> | null = null, title: string = 'Title'): any {
  return new Task(title, action || (() => null));
}
