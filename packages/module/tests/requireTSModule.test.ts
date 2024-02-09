import { requireTSModule } from '../src/requireTSModule';
import { describe, it, expect } from 'vitest';

describe('requireTSModule()', () => {
	it('errors if not a .ts file or .tsx file', () => {
		expect(() => {
			requireTSModule('some-fake-module');
		}).toThrow(
			'Unable to import non-TypeScript file "some-fake-module", use `requireModule` instead.',
		);
	});
});
