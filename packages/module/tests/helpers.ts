import path from 'path';

export function getFixture(file: string): string {
	return path.join(path.dirname(import.meta.url), '__fixtures__', file);
}
