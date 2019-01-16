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
import { getFixturePath } from './fixtures';
import { TestTool, TestToolConfig, TestToolPluginRegistry, ToolLike } from './types';

export function mockDebugger(): Debugger {
  const debug = jest.fn();

  // @ts-ignore Allow property access
  debug.invariant = jest.fn();

  return debug as any;
}

export function mockTool(options?: Partial<ToolOptions>, baseTool?: ToolLike): any {
  const tool = (baseTool ||
    new Tool<TestToolPluginRegistry, TestToolConfig>({
      appName: 'test-boost',
      appPath: getFixturePath('app'),
      ...options,
    })) as Tool<any, any>;

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

export function mockConsole(tool: ToolLike): any {
  const cli = new Console(tool as Tool<any, any>, {
    stderr: jest.fn(),
    stdout: jest.fn(),
  });

  cli.err = jest.fn();
  cli.out = jest.fn();

  return cli;
}

export function mockRoutine(tool: ToolLike, key: string = 'key', title: string = 'Title'): any {
  const routine = new Routine<any, TestTool>(key, title);

  routine.tool = tool as Tool<any, any>;
  routine.debug = mockDebugger();
  routine.action = jest.fn((context, value) => Promise.resolve(value)); // Avoid execute exception
  routine.execute = routine.action as any;

  return routine;
}

export function mockTask(action: TaskAction<any> | null = null, title: string = 'Title'): any {
  return new Task(title, action || jest.fn());
}
