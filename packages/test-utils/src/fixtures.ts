/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import path from 'path';
import fs from 'fs-extra';

export const FIXTURES_DIR = path.join(process.cwd(), 'tests/__fixtures__');

export function getFixturePath(fixture: string, file: string = ''): string {
  return path.join(FIXTURES_DIR, fixture, file);
}

export function getNodeModulePath(fixture: string, name: string, file: string = ''): string {
  return path.join(getFixturePath(fixture), `./node_modules/${name}`, file);
}

export function copyFixtureToNodeModule(from: string, to: string, name: string): () => void {
  const modulePath = getNodeModulePath(to, name);

  fs.copySync(getFixturePath(from), modulePath, { overwrite: true });

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

export function createTempFileInFixture(fixture: string, file: string, data: any): () => void {
  const filePath = getFixturePath(fixture, file);

  fs.writeFileSync(filePath, data);

  return () => fs.removeSync(filePath);
}
