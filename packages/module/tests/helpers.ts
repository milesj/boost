import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFixture(file: string): string {
	return path.join(path.dirname(fileURLToPath(import.meta.url)), '__fixtures__', file);
}
