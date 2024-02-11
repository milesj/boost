import type { SelectOptionLike } from '../src/react';

// const isWindows = process.platform === 'win32';

export const KEYS = {
	// backspace: isWindows ? '\u0008' : '\u007F',
	// delete: isWindows ? '\u007F' : '\u001B[3~',
	backspace: '\u0008',
	delete: '\u007F',
	down: '\u001B[B',
	escape: '\u001B',
	left: '\u001B[D',
	pageDown: '\u001B[6~',
	pageUp: '\u001B[5~',
	return: '\r',
	right: '\u001B[C',
	tab: '\t',
	up: '\u001B[A',
};

export const options: SelectOptionLike<string>[] = [
	{ label: 'B', divider: true },
	{ label: 'Black', value: 'black' },
	{ label: 'Blue', value: 'blue' },
	{ label: 'Brown', value: 'brown' },
	{ label: 'C', divider: true },
	{ label: 'Cyan', value: 'cyan' },
	{ label: 'G', divider: true },
	{ label: 'Gray', value: 'gray' },
	{ label: 'Green', value: 'green' },
	{ label: 'O', divider: true },
	{ label: 'Orange', value: 'orange' },
	{ label: 'P', divider: true },
	{ label: 'Purple', value: 'purple' },
	{ label: 'R', divider: true },
	{ label: 'Red', value: 'red' },
	{ label: 'W', divider: true },
	{ label: 'White', value: 'white' },
	{ label: 'Y', divider: true },
	{ label: 'Yellow', value: 'yellow' },
];

export const optionsWithoutDivider = options.filter((o) => !('divider' in o)) as {
	label: string;
	value: string;
}[];
