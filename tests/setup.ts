/* eslint-disable no-underscore-dangle */

import { expect, vi } from 'vitest';

// @ts-expect-error Allow access
global.__DEV__ = true;
global.__PROD__ = true;
// @ts-expect-error Allow access
global.__TEST__ = true;

expect.extend({
	toBeFilePath(received, expected) {
		let path = String(expected);

		if (process.platform === 'win32') {
			path = path.replace(/\//g, '\\');
		}

		if (this.isNot) {
			expect(received).not.toBe(path);
		} else {
			expect(received).toBe(path);
		}

		return { pass: !this.isNot, message: () => '' };
	},
});

global.delay = function delay(time: number = 100) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

// Differs between osx/windows
vi.mock('figures', async (importOriginal) => ({
	default: {
		...(await importOriginal<object>()),
		tick: '^',
		cross: 'x',
		pointer: '>>',
		pointerSmall: '>',
		circleDotted: 'o',
		bullet: '●',
	},
}));

// Focus is required for snapshots
vi.mock('ink', async (importOriginal) => ({
	...(await importOriginal<object>()),
	useFocus: () => ({ isFocused: true }),
	useFocusManager: () => ({ focusNext() {} }),
}));
