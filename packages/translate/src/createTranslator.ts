import i18next from 'i18next';
import { Path, toArray } from '@boost/common';
import LocaleDetector from './LocaleDetector';
import FileBackend from './FileBackend';
import { Locale, Translator, InterpolationParams, Format, MessageOptions } from './types';

// istanbul ignore next
function handleError(error: Error | null) {
  if (error) {
    throw error;
  }
}

export interface TranslatorOptions {
  /** Automatically detect the locale from the environment. Defaults to `true`. */
  autoDetect?: boolean;
  /** Enable debugging by logging info to the console. */
  debug?: boolean;
  /** Fallback locale(s) to use when the detected locale isn't translated. Defaults to `en` */
  fallbackLocale?: Locale | Locale[];
  /** Locale to explicitly override with and use. */
  locale?: Locale;
  /** Order in which to load and lookup locale translations. */
  lookupType?: i18next.InitOptions['load'];
  /** Format resource bundles are written in for the current translator. Defaults to `yaml`. */
  resourceFormat?: Format;
}

export default function createTranslator(
  namespace: string | string[],
  resourcePath: Path | Path[],
  {
    autoDetect = true,
    debug = false,
    fallbackLocale = 'en',
    locale,
    lookupType,
    resourceFormat = 'yaml',
  }: TranslatorOptions = {},
): Translator {
  const namespaces = toArray(namespace);
  const resourcePaths = toArray(resourcePath);

  if (namespaces.length === 0) {
    throw new Error('A namespace is required for translations.');
  } else if (resourcePaths.length === 0) {
    throw new Error('At least 1 resource directory path is required.');
  } else if (!autoDetect && !locale) {
    throw new Error('A locale must be defined if auto-detection is disabled.');
  }

  const translator = i18next.createInstance().use(new FileBackend());

  if (autoDetect) {
    translator.use(new LocaleDetector());
  }

  translator.init(
    {
      backend: {
        format: resourceFormat,
        paths: resourcePaths,
      },
      debug,
      defaultNS: namespaces[0],
      fallbackLng: fallbackLocale,
      initImmediate: false,
      lng: locale,
      load: lookupType,
      lowerCaseLng: true,
      ns: namespaces,
      returnNull: false,
    },
    handleError,
  );

  function msg(
    key: string | string[],
    params?: InterpolationParams,
    { interpolation, locale: lng, ...options }: MessageOptions = {},
  ): string {
    return translator.t(key, {
      interpolation: { escapeValue: false, ...interpolation },
      ...options,
      lng,
      replace: params,
    });
  }

  msg.dir = translator.dir();
  msg.locale = translator.language;

  msg.changeLocale = (lang: Locale) => {
    translator.changeLanguage(lang, error => {
      handleError(error);

      msg.dir = translator.dir();
      msg.locale = translator.language;
    });
  };

  if (process.env.NODE_ENV === 'test') {
    msg.i18n = translator;
  }

  return msg;
}
