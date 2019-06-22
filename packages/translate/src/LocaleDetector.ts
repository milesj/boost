import i18next from 'i18next';
import osLocale from 'os-locale';
import { debug } from './constants';
import { Locale } from './types';

export default class LocaleDetector implements i18next.LanguageDetectorModule {
  locale: Locale = 'en';

  type: 'languageDetector' = 'languageDetector';

  init() {
    // We don't need this but is required by the interface
  }

  cacheUserLanguage(locale: Locale) {
    this.locale = locale;
  }

  detect(): Locale {
    if (this.locale) {
      debug('Locale manually provided');

      return this.locale;
    }

    return this.detectFromArgv() || this.detectFromOS();
  }

  detectFromArgv(): Locale | undefined {
    const args = process.argv;
    const index = args.findIndex(arg => arg === '--locale');
    const nextIndex = index + 1;

    if (index >= 0 && args[nextIndex] && !args[nextIndex].startsWith('-')) {
      debug('Locale detected from --locale option');

      return args[nextIndex];
    }

    return undefined;
  }

  detectFromOS(): Locale {
    debug('Locale detected from operating system');

    return osLocale.sync().replace(/_/gu, '-');
  }
}
