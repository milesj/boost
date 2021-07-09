import { interopModule } from '../interopModule';
import { PathLike } from '../types';

export async function importTSModule<T>(path: PathLike): Promise<T> {
  const filePath = String(path);

  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    throw new Error(
      `Unable to import non-TypeScript file "${filePath}", use \`requireModule\` instead.`,
    );
  }

  return interopModule(await import(filePath)) as Promise<T>;
}
