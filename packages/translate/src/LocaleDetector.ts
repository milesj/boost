import i18next from 'i18next';
import osLocale from 'os-locale';
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
    return this.locale || this.detectFromArgv() || this.detectFromOS();
  }

  detectFromArgv(): Locale | undefined {
    const args = process.argv;
    const index = args.findIndex(arg => arg === '--locale');
    const nextIndex = index + 1;

    if (index >= 0 && args[nextIndex] && !args[nextIndex].startsWith('-')) {
      return args[nextIndex];
    }

    return undefined;
  }

  detectFromOS(): Locale {
    return osLocale
      .sync()
      .toLowerCase()
      .replace(/_/gu, '-');
  }
}
