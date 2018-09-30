/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import osLocale from 'os-locale';

export default class LanguageDetector {
  language: string = '';

  type: string = 'languageDetector';

  init() {
    // Required
  }

  cacheUserLanguage(language: string) {
    this.language = language;
  }

  detect(): string {
    return (
      this.language ||
      osLocale
        .sync()
        .toLowerCase()
        .replace(/_/gu, '-')
    );
  }
}
