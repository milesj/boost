import { i18n, InterpolationOptions } from 'i18next';

export type Direction = 'ltr' | 'rtl';

export type Format = 'js' | 'json' | 'yaml';

export type Locale = string;

export type InterpolationParams = Record<string, unknown>;

export interface MessageOptions {
	/** Default value to return if a translation was not found. */
	defaultValue?: string;
	/** Count used to determine plurals. */
	count?: number;
	/** Context used for special parsing (male, female, etc). */
	context?: string;
	/** Interpolation options to pass down. */
	interpolation?: InterpolationOptions;
	/** Force translation to this locale. */
	locale?: Locale;
	/** Post-processors to run on the translation. */
	postProcess?: string[] | string;
}

export interface Translator {
	(key: string[] | string, params?: InterpolationParams, options?: MessageOptions): string;
	direction: Direction;
	locale: Locale;
	changeLocale: (locale: Locale) => Promise<void>;
	/** @internal */
	i18n: i18n;
}
