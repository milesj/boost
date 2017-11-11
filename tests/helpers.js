import fs from 'fs-extra';
import path from 'path';
import Renderer from '../src/Renderer';

// This is super janky as tests touch the filesystem, which is slow.
// But getting `fs` and `require` to work correctly with Jest mocks
// and the `mock-fs` module was problematic.

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

export class MockRenderer extends Renderer {
  start() {}

  stop() {}

  update() {}
}
