import i18next from 'i18next';
import { Path, toArray } from '@boost/common';
import LocaleDetector from './LocaleDetector';
import FileBackend from './FileBackend';
import { Locale, Translator, InterpolationParams } from './types';

// istanbul ignore next
function handleError(error: Error | null) {
  if (error) {
    throw error;
  }
}

export interface TranslatorOptions {
  debug?: boolean;
  fallbackLocale?: Locale;
  load?: i18next.InitOptions['load'];
  locale?: Locale;
}

export default function createTranslator(
  namespace: string | string[],
  resourcePath: Path | Path[],
  { debug, fallbackLocale, load, locale }: TranslatorOptions = {},
): Translator {
  const namespaces = toArray(namespace);
  const resourcePaths = toArray(resourcePath);

  if (namespaces.length === 0) {
    throw new Error('A namespace is required for translations.');
  } else if (resourcePaths.length === 0) {
    throw new Error('At least 1 resource file path is required.');
  }

  const translator = i18next
    .createInstance()
    .use(new LocaleDetector())
    .use(new FileBackend());

  translator.init(
    {
      backend: {
        resourcePaths,
      },
      debug,
      defaultNS: namespaces[0],
      fallbackLng: fallbackLocale || 'en',
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

  msg.changeLocale = lang => {
    translator.changeLanguage(lang, error => {
      handleError(error);

      msg.dir = translator.dir();
      msg.locale = translator.language;
    });
  };

  return msg;
}
