import fs from 'fs-extra';
import path from 'path';
import Tool from '../src/Tool';
import Routine from '../src/Routine';

// This is super janky as tests touch the filesystem, which is slow.
// But getting `fs` and `require` to work correctly with Jest mocks
// and the `mock-fs` module was super painful.

export function getFixturePath(fixture, file = '') {
  return path.join(__dirname, `./fixtures/${fixture}`, file);
}

export function getTestRoot() {
  return getFixturePath('app');
}

export function getModulePath(name, file = '') {
  return path.join(getTestRoot(), `./node_modules/${name}`, file);
}

export function copyFixtureToModule(fixture, name) {
  const modulePath = getModulePath(name);

  fs.copySync(getFixturePath(fixture), modulePath, { overwrite: true });

  fs.writeJsonSync(path.join(modulePath, 'package.json'), {
    main: './index.js',
    name,
    version: '0.0.0',
  });

  return () => fs.removeSync(modulePath);
}

export function copyFixtureToMock(fixture, name) {
  const module = require.requireActual(getFixturePath(fixture));

  jest.doMock(name, () => module, { virtual: true });

  return () => jest.dontMock(name);
}

export function createTempFileInRoot(file, data) {
  const filePath = getFixturePath('app', file);

  fs.writeFileSync(filePath, data);

  return () => fs.removeSync(filePath);
}

export function createTestTool(options) {
  const tool = new Tool({
    appName: 'test-boost',
    ...options,
  });
  tool.config = {};
  tool.package = {};
  tool.initialized = true; // Avoid loaders

  return tool;
}

export function createTestRoutine(tool, key = 'key') {
  const routine = new Routine(key, 'Title');
  routine.tool = tool;
  routine.debug = () => {};
  routine.action = (context, value) => value; // Avoid execute exception

  return routine;
}
