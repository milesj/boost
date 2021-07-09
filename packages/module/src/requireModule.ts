import { interopRequireModule } from './interopRequireModule';
import { PathLike } from './types';
import { requireTypedModule } from './typescript/requireTypedModule';

export function requireModule<T>(path: PathLike): T {
  const filePath = String(path);

  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return requireTypedModule(filePath);
  }

  return interopRequireModule(filePath) as T;
}
