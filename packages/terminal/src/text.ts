import ansiEscapes from 'ansi-escapes';
import ansiRegex from 'ansi-regex';
import cliTruncate from 'cli-truncate';
import slice from 'slice-ansi';
import stringWidth from 'string-width';
import strip from 'strip-ansi';
import supportsHyperlinks from 'supports-hyperlinks';
import wrap from 'wrap-ansi';

/** Regular expression for matching ANSI escape codes. */
export const ANSI_REGEX = ansiRegex();

/**
 * Can be used to wrap a piece of text with a visual annotation _(iTerm only)_. If a terminal doe
 * not support annotations, it will pass the text through.
 *
 * ```ts
 * import { annotate } from '@boost/terminal';
 *
 * const text = annotate('fileName.js', absFilePath);
 * ```
 */
export function annotate(text: string, annotation: string): string {
	if (supportsHyperlinks().stdout) {
		return `\u001B]1337;AddAnnotation=${text.length}|${annotation}\u0007${text}`;
	}

	return text;
}

/**
 * Calculate and return the visual width of a string (number of terminal columns required).
 * Based on [string-width](https://www.npmjs.com/package/string-width).
 *
 * ```ts
 * import { calculateWidth } from '@boost/terminal';
 *
 * calculateWidth('古'); // 2
 * ```
 */
export function calculateWidth(text: string): number {
	return stringWidth(text);
}

/**
 * Returns true if the string contains ANSI escape codes.
 * Based on [ansi-regex](https://www.npmjs.com/package/ansi-regex).
 *
 * ```ts
 * import { hasAnsi } from '@boost/terminal';
 *
 * hasAnsi('\u001B[4mTest\u001B[0m'); // true
 * ```
 */
export function hasAnsi(value: string): boolean {
	return ANSI_REGEX.test(value);
}

/**
 * Can be used to wrap a piece of text in an ANSI escape code hyperlink.
 * If a terminal does not support hyperlinks, it will pass the text through.
 *
 * ```ts
 * import { link } from '@boost/terminal';
 *
 * const text = link('Read the manual', 'https://boostlib.dev');
 * ```
 */
export function link(text: string, url: string): string {
	if (supportsHyperlinks().stdout) {
		return ansiEscapes.link(text, url);
	}

	return text;
}

/**
 * Slice a string while preserving ANSI escape codes.
 * Based on [slice-ansi](https://www.npmjs.com/package/slice-ansi).
 *
 * ```ts
 * import { sliceAnsi } from '@boost/terminal';
 *
 * const text = sliceAnsi(aStringThatMayContainAnsi, 15, 25);
 * ```
 */
export function sliceAnsi(text: string, start: number, end?: number): string {
	return slice(text, start, end)!;
}

/**
 * Strip all ANSI escape codes from the provided string.
 * Based on [strip-ansi](https://www.npmjs.com/package/strip-ansi).
 *
 * ```ts
 * import { stripAnsi } from '@boost/terminal';
 *
 * const text = stripAnsi(aStringThatContainsAnsi);
 * ```
 */
export function stripAnsi(text: string): string {
	return strip(text);
}

export type TruncateOptions = cliTruncate.Options;

/**
 * Truncate a string to a desired terminal width while preserving ANSI escape codes,
 * Unicode surrogate pairs, and fullwidth characters.
 * Based on [cli-truncate](https://www.npmjs.com/package/cli-truncate).
 *
 * ```ts
 * import { truncate } from '@boost/terminal';
 *
 * const text = truncate(aStringThatMayContainAnsi, 10, { position: 'middle' });
 * ```
 */
export function truncate(text: string, width: number, options?: TruncateOptions): string {
	return cliTruncate(text, width, options);
}

export interface WrapOptions {
	hard?: boolean;
	trim?: boolean;
	wordWrap?: boolean;
}

/**
 * Wrap a string that contains ANSI escape codes to a desired terminal width.
 * Based on [wrap-ansi](https://www.npmjs.com/package/wrap-ansi).
 *
 * ```ts
 * import { wrapAnsi } from '@boost/terminal';
 *
 * const text = wrapAnsi(aStringThatContainsAnsi, 20);
 * ```
 */
export function wrapAnsi(text: string, width: number, options?: WrapOptions): string {
	return wrap(text, width, options);
}
