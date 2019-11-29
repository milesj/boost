import path from 'path';
import fs from 'fs-extra';

const FIXTURES_DIR = path.join(process.cwd(), 'tests/__fixtures__');

const TEMPORARY_FILES = new Set<string>();

export function normalizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/gu, '/');
}

export function getFixturePath(fixture: string, file: string = ''): string {
  return normalizePath(path.join(FIXTURES_DIR, fixture, file));
}

export function getFixtureNodeModulePath(
  fixture: string,
  moduleName: string,
  file: string = '',
): string {
  return normalizePath(path.join(FIXTURES_DIR, fixture, 'node_modules', moduleName, file));
}

export function getNodeModulePath(moduleName: string, file: string = ''): string {
  return normalizePath(path.join(process.cwd(), 'node_modules', moduleName, file));
}

export function removeTempFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }

  TEMPORARY_FILES.delete(filePath);
}

export function copyFixtureToNodeModule(
  fixture: string,
  moduleName: string,
  customModulePath: boolean = false,
): () => void {
  const modulePath = customModulePath ? normalizePath(moduleName) : getNodeModulePath(moduleName);
  const pkgPath = normalizePath(path.join(modulePath, 'package.json'));

  fs.copySync(getFixturePath(fixture), modulePath, { overwrite: true });

  if (!fs.existsSync(pkgPath)) {
    fs.writeJsonSync(pkgPath, {
      main: './index.js',
      name: moduleName,
      version: '0.0.0',
    });
  }

  return () => removeTempFile(modulePath);
}

export function copyFixtureToMock(fixture: string, mockName: string): () => void {
  const module = require.requireActual(getFixturePath(fixture));

  jest.doMock(mockName, () => module, { virtual: true });

  return () => jest.dontMock(mockName);
}

export function createTempFileInFixture(fixture: string, file: string, data: unknown): () => void {
  const filePath = getFixturePath(fixture, file);

  fs.writeFileSync(filePath, data);

  return () => removeTempFile(filePath);
}

if (typeof afterAll === 'function') {
  afterAll(() => {
    Array.from(TEMPORARY_FILES).forEach(tempFile => {
      removeTempFile(tempFile);
    });
  });
}
