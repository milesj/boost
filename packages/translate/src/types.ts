import i18next from 'i18next';

export type Direction = 'ltr' | 'rtl';

export type Locale = string;

export interface InterpolationParams {
  [key: string]: any;
}

export interface Translator {
  dir: Direction;
  locale: Locale;
  (key: string | string[], params?: InterpolationParams, options?: i18next.TOptions): string;
  changeLocale(locale: Locale): void;
}
