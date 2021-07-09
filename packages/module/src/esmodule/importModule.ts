import { interopModule } from '../interopModule';
import { PathLike } from '../types';
import { importTSModule } from './importTSModule';

export async function importModule<T>(path: PathLike): Promise<T> {
  const filePath = String(path);

  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return importTSModule(filePath);
  }

  return interopModule(await import(filePath)) as Promise<T>;
}
