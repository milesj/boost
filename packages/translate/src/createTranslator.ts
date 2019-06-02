import i18next from 'i18next';
import { Path, toArray } from '@boost/common';
import LocaleDetector from './LocaleDetector';
import FileBackend from './FileBackend';
import { Locale, Translator, InterpolationParams, Format } from './types';

// istanbul ignore next
function handleError(error: Error | null) {
  if (error) {
    throw error;
  }
}

export interface TranslatorOptions {
  autoDetect?: boolean;
  debug?: boolean;
  fallbackLocale?: Locale | Locale[];
  load?: i18next.InitOptions['load'];
  locale?: Locale;
  resourceFormat?: Format;
}

export default function createTranslator(
  namespace: string | string[],
  resourcePath: Path | Path[],
  {
    autoDetect = true,
    debug,
    fallbackLocale = 'en',
    resourceFormat = 'json',
    load,
    locale,
  }: TranslatorOptions = {},
): Translator {
  const namespaces = toArray(namespace);
  const resourcePaths = toArray(resourcePath);

  if (namespaces.length === 0) {
    throw new Error('A namespace is required for translations.');
  } else if (resourcePaths.length === 0) {
    throw new Error('At least 1 resource directory is required.');
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
      load,
      lowerCaseLng: true,
      ns: namespaces,
    },
    handleError,
  );

  function msg(key: string | string[], params?: InterpolationParams) {
    return translator.t(key, {
      interpolation: { escapeValue: false },
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

  return msg;
}
