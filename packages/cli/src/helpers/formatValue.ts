import { PrimitiveType } from '@boost/args';

export function formatValue(value: PrimitiveType): string {
	switch (typeof value) {
		case 'string':
			return `"${value}"`;
		default:
			return String(value);
	}
}
