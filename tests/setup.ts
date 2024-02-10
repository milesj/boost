import { vi, expect } from 'vitest';

global.__DEV__ = true;
global.__PROD__ = true;
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

		return { pass: !this.isNot, message: '' };
	},
});

global.delay = function delay(time: number = 100) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

// Differs between osx/windows
vi.mock('figures', async () => ({
	...(await vi.importActual('figures')),
	tick: '^',
	cross: 'x',
	pointer: '>>',
	pointerSmall: '>',
	circleDotted: 'o',
	bullet: '●',
}));

// Focus is required for snapshots
vi.mock('ink', async () => ({
	...(await vi.importActual('ink')),
	useFocus: () => ({ isFocused: true }),
	useFocusManager: () => ({ focusNext() {} }),
}));
