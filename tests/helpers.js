import path from 'path';

export function createMockFilePath(mock) {
  return path.join('/mock', mock);
}

export function createMockModulePath(mock) {
  return path.join('/mock/node_modules', mock);
}

export function mockFilePath(mock, factory) {
  jest.doMock(createMockFilePath(mock), factory, { virtual: true });
}

export function mockModulePath(mock, factory) {
  jest.doMock(createMockModulePath(mock), factory, { virtual: true });
}

export function removeFileMock(mock) {
  jest.dontMock(createMockFilePath(mock));
}

export function removeModuleMock(mock) {
  jest.dontMock(createMockModulePath(mock));
}
