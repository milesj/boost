import { interopModule } from '../interopModule';
import { PathLike } from '../types';
import { requireTSModule } from './requireTSModule';

export function requireModule<T>(path: PathLike): T {
  const filePath = String(path);

  if (filePath.endsWith('.mjs')) {
    throw new Error(`Unable to require non-CommonJS file "${filePath}", use ES imports instead.`);
  }

  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return requireTSModule(filePath);
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return interopModule(require(filePath)) as T;
}
