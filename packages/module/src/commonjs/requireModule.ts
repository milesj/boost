import { PathLike } from '../types';
import { interopRequireModule } from './interopRequireModule';
import { requireTSModule } from './requireTSModule';

export function requireModule<T>(path: PathLike): T {
  const filePath = String(path);

  if (filePath.endsWith('.mjs')) {
    throw new Error(`Unable to require non-CommonJS file "${filePath}", use ES imports instead.`);
  }

  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return requireTSModule(filePath);
  }

  return interopRequireModule(filePath) as T;
}
