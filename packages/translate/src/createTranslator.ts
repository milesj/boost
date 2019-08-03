import i18next from 'i18next';
import { Path, toArray } from '@boost/common';
import { RuntimeError } from '@boost/internal';
import LocaleDetector from './LocaleDetector';
import FileBackend from './FileBackend';
import { debug } from './constants';
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
  /** Fallback locale(s) to use when the detected locale isn't translated. Defaults to `en`. */
  fallbackLocale?: Locale | Locale[];
  /** Locale to explicitly use. */
  locale?: Locale;
  /** Order in which to load and lookup locale translations. */
  lookupType?: i18next.InitOptions['load'];
  /** File format resource bundles are written in. Defaults to `yaml`. */
  resourceFormat?: Format;
}

export default function createTranslator(
  namespace: string | string[],
  resourcePath: Path | Path[],
  {
    autoDetect = true,
    debug: debugOpt = false,
    fallbackLocale = 'en',
    locale,
    lookupType,
    resourceFormat = 'yaml',
  }: TranslatorOptions = {},
): Translator {
  const namespaces = toArray(namespace);
  const resourcePaths = toArray(resourcePath);

  if (namespaces.length === 0) {
    throw new RuntimeError('translate', 'TL_REQ_NAMESPACE');
  } else if (resourcePaths.length === 0) {
    throw new RuntimeError('translate', 'TL_REQ_RES_PATHS');
  } else if (!autoDetect && !locale) {
    throw new RuntimeError('translate', 'TL_REQ_MANUAL_LOCALE');
  }

  debug('New translator created');
  debug('  Namespaces: %s', namespaces.join(', '));
  debug('  Resource paths: %s', resourcePaths.join(', '));

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
      debug: debugOpt,
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
    debug('Locale manually changed to %s', lang);

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
