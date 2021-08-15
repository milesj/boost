import prettyMs, { Options } from 'pretty-ms';

/**
 * Can be used to format a UNIX timestamp in milliseconds into a shorthand human readable format.
 * Wraps the [pretty-ms](https://www.npmjs.com/package/pretty-ms) package to handle infinite
 * numbers, zeros, and more.
 *
 * ```ts
 * import { formatMs } from '@boost/common';
 *
 * formatMs(1337000000); // 15d 11h 23m 20s
 * ```
 */
export function formatMs(ms: number, options?: Options): string {
	if (!Number.isFinite(ms) || ms === 0) {
		return '0s';
	}

	return prettyMs(ms, { keepDecimalsOnWholeSeconds: true, ...options });
}
