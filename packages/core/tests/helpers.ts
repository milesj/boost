import fs from 'fs-extra';
import path from 'path';
import Tool, { ToolOptions, ToolConfig, ToolPluginRegistry } from '../src/Tool';
import Routine from '../src/Routine';
import Console from '../src/Console';
import Plugin from '../src/Plugin';
import { PluginSetting } from '../src/types';

// This is super janky as tests touch the filesystem, which is slow.
// But getting `fs` and `require` to work correctly with Jest mocks
// and the `mock-fs` module was super painful.

export function getFixturePath(fixture: string, file: string = ''): string {
  return path.join(__dirname, `./fixtures/${fixture}`, file);
}

export function getTestRoot(): string {
  return getFixturePath('app');
}

export function getModulePath(name: string, file: string = ''): string {
  return path.join(getTestRoot(), `./node_modules/${name}`, file);
}

export function copyFixtureToModule(fixture: string, name: string): () => void {
  const modulePath = getModulePath(name);

  fs.copySync(getFixturePath(fixture), modulePath, { overwrite: true });

  fs.writeJsonSync(path.join(modulePath, 'package.json'), {
    main: './index.js',
    name,
    version: '0.0.0',
  });

  return () => fs.removeSync(modulePath);
}

export function copyFixtureToMock(fixture: string, name: string): () => void {
  const module = require.requireActual(getFixturePath(fixture));

  jest.doMock(name, () => module, { virtual: true });

  return () => jest.dontMock(name);
}

export function createTempFileInRoot(file: string, data: any): () => void {
  const filePath = getFixturePath('app', file);

  fs.writeFileSync(filePath, data);

  return () => fs.removeSync(filePath);
}

export function createTestDebugger(): any {
  const debug = jest.fn();

  // @ts-ignore
  debug.invariant = jest.fn();

  return debug;
}

export interface TestPluginRegistry extends ToolPluginRegistry {
  plugin: Plugin;
}

export interface TestToolConfig extends ToolConfig {
  plugins: PluginSetting<Plugin>;
}

export type TestTool = Tool<TestPluginRegistry, TestToolConfig>;

export const TEST_PACKAGE_JSON = {
  name: '',
  version: '0.0.0',
};

export const TEST_TOOL_CONFIG = {
  debug: false,
  extends: [],
  locale: '',
  output: 2,
  plugins: [],
  reporters: [],
  settings: {},
  silent: false,
  theme: 'default',
};

export function createTestTool(options?: Partial<ToolOptions>): TestTool {
  const tool = new Tool<TestPluginRegistry, TestToolConfig>({
    appName: 'test-boost',
    appPath: __dirname,
    ...options,
  });

  tool.registerPlugin('plugin', Plugin);
  tool.args = { $0: '', _: [] };
  tool.config = { ...TEST_TOOL_CONFIG };
  tool.package = { ...TEST_PACKAGE_JSON };
  // @ts-ignore Allow private access and avoid loaders
  tool.initialized = true;

  return tool;
}

export function createTestRoutine(
  tool: TestTool | null = null,
  key: string = 'key',
  title: string = 'Title',
): Routine<any, any> {
  const routine = new Routine<{}, TestTool>(key, title);

  routine.tool = tool || createTestTool();
  routine.debug = createTestDebugger();
  routine.action = (context, value) => Promise.resolve(value); // Avoid execute exception
  routine.execute = routine.action as any;

  return routine;
}

export function createTestConsole(): Console {
  const cli = new Console(createTestTool());
  cli.err = jest.fn();
  cli.out = jest.fn();

  return cli;
}
