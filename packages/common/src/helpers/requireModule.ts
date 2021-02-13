import interopRequireModule from '../internal/interopRequireModule';
import { PortablePath } from '../types';
import requireTypedModule from './requireTypedModule';

export default function requireModule<T>(path: PortablePath): T {
  const filePath = String(path);

  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return requireTypedModule(filePath);
  }

  return interopRequireModule(filePath) as T;
}
