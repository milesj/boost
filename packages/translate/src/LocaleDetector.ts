import { LanguageDetectorModule } from 'i18next';
import osLocale from 'os-locale';
import debug from './debug';
import { Locale } from './types';

export default class LocaleDetector implements LanguageDetectorModule {
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
			debug('Locale "%s" manually provided', this.locale);

			return this.locale;
		}

		return this.detectFromArgv() || this.detectFromOS();
	}

	detectFromArgv(): Locale | undefined {
		const args = process.argv;
		const index = args.findIndex((arg) => arg === '--locale');
		const nextIndex = index + 1;

		if (index >= 0 && args[nextIndex] && !args[nextIndex].startsWith('-')) {
			const locale = args[nextIndex];

			debug('Locale "%s" detected from --locale option', locale);

			return locale;
		}

		return undefined;
	}

	detectFromOS(): Locale {
		const locale = osLocale.sync().replace(/_/gu, '-');

		debug('Locale "%s" detected from operating system', locale);

		return locale;
	}
}
