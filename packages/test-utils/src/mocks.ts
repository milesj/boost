/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Tool, ToolOptions, Plugin, Debugger, Console, Routine } from '@boost/core';
import { stubArgs, stubPackageJson, stubToolConfig } from './stubs';
import { TestTool, TestToolConfig, TestPluginRegistry } from './types';

export function mockDebugger(): Debugger {
  const debug = jest.fn();

  // @ts-ignore Allow property access
  debug.invariant = jest.fn();

  return debug as any;
}

export function mockTool<T extends TestTool>(options?: Partial<ToolOptions>): T {
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

  return tool as any;
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

export function mockRoutine(
  tool: Tool<any, any>,
  key: string = 'key',
  title: string = 'Title',
): Routine<any, TestTool> {
  const routine = new Routine<any, TestTool>(key, title);

  routine.tool = tool;
  routine.debug = mockDebugger();
  routine.action = (context, value) => Promise.resolve(value); // Avoid execute exception

  return routine;
}
