import i18next from 'i18next';

export type Direction = 'ltr' | 'rtl';

export type Format = 'js' | 'json' | 'yaml';

export type Locale = string;

export interface InterpolationParams {
  [key: string]: any;
}

export interface MessageOptions {
  /** Default value to return if a translation was not found. */
  defaultValue?: string;
  /** Count used to determine plurals. */
  count?: number;
  /** Context used for special parsing (male, female, etc). */
  context?: string;
  /** Interpolation options to pass down. */
  interpolation?: i18next.InterpolationOptions;
  /** Force translation to this locale. */
  locale?: Locale;
  /** Post-processors to run on the translation. */
  postProcess?: string | string[];
}

export interface Translator {
  dir: Direction;
  locale: Locale;
  (key: string | string[], params?: InterpolationParams, options?: MessageOptions): string;
  changeLocale(locale: Locale): void;
  // Testing only
  // eslint-disable-next-line @typescript-eslint/member-ordering
  i18n: i18next.i18n;
}
