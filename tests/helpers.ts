import fs from 'fs-extra';
import path from 'path';
import Tool, { ToolOptions, ToolInterface } from '../src/Tool';
import Routine from '../src/Routine';
import { DEFAULT_TOOL_CONFIG } from '../src/constants';

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

export function createTestTool(options?: Partial<ToolOptions>): Tool<any> {
  const tool = new Tool({
    appName: 'test-boost',
    ...options,
  });

  tool.config = { ...DEFAULT_TOOL_CONFIG };
  tool.package = { name: '' };
  tool.initialized = true; // Avoid loaders

  return tool;
}

export function createTestRoutine(
  tool: Tool<any> | ToolInterface | null = null,
  key: string = 'key',
  title: string = 'Title',
): Routine<any, any> {
  const routine = new Routine(key, title);

  routine.tool = tool || createTestTool();
  routine.debug = createTestDebugger();
  routine.action = (context, value) => Promise.resolve(value); // Avoid execute exception
  routine.execute = routine.action as any;

  return routine;
}
