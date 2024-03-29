import { mockNormalizedFilePath } from '@boost/common/test';

export function mockSystemPath(part: string, wrap: boolean = true) {
	return process.platform === 'win32' && wrap && !part.match(/^[A-Z]:/u)
		? mockNormalizedFilePath('D:', part)
		: mockNormalizedFilePath(part);
}
