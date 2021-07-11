import ansiEscapes from 'ansi-escapes';
import ansiRegex from 'ansi-regex';
import cliTruncate from 'cli-truncate';
import slice from 'slice-ansi';
import stringWidth from 'string-width';
import strip from 'strip-ansi';
import supportsHyperlinks from 'supports-hyperlinks';
import wrap from 'wrap-ansi';

export const ANSI_REGEX = ansiRegex();

export function annotate(text: string, annotation: string): string {
	if (supportsHyperlinks().stdout) {
		return `\u001B]1337;AddAnnotation=${text.length}|${annotation}\u0007${text}`;
	}

	return text;
}

export function calculateWidth(text: string): number {
	return stringWidth(text);
}

export function hasAnsi(value: string): boolean {
	return ANSI_REGEX.test(value);
}

export function link(text: string, url: string): string {
	if (supportsHyperlinks().stdout) {
		return ansiEscapes.link(text, url);
	}

	return text;
}

export function sliceAnsi(text: string, start: number, end?: number): string {
	return slice(text, start, end);
}

export function stripAnsi(text: string): string {
	return strip(text);
}

export type TruncateOptions = cliTruncate.Options;

export function truncate(text: string, width: number, options?: TruncateOptions): string {
	return cliTruncate(text, width, options);
}

export interface WrapOptions {
	hard?: boolean;
	trim?: boolean;
	wordWrap?: boolean;
}

export function wrapAnsi(text: string, width: number, options?: WrapOptions): string {
	return wrap(text, width, options);
}
