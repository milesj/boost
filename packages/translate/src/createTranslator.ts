import { createInstance, InitOptions } from 'i18next';
import { Path, PortablePath, toArray } from '@boost/common';
import { debug } from './debug';
import { FileBackend } from './FileBackend';
import { LocaleDetector } from './LocaleDetector';
import { TranslateError } from './TranslateError';
import { Format, InterpolationParams, Locale, MessageOptions, Translator } from './types';

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
	lookupType?: InitOptions['load'];
	/** File format resource bundles are written in. Defaults to `yaml`. */
	resourceFormat?: Format;
}

/**
 * Create and return a `Translator` instance with the defined namespace.
 * A list of resource paths are required for locating translation files.
 */
export function createTranslator(
	namespace: string[] | string,
	resourcePath: PortablePath | PortablePath[],
	options: TranslatorOptions = {},
): Translator {
	const {
		autoDetect = true,
		debug: debugOpt = false,
		fallbackLocale = 'en',
		locale,
		lookupType = 'all',
		resourceFormat = 'yaml',
	} = options;
	const namespaces = toArray(namespace);
	const resourcePaths = toArray(resourcePath).map(Path.create);

	if (namespaces.length === 0) {
		throw new TranslateError('NAMESPACE_REQUIRED');
	} else if (resourcePaths.length === 0) {
		throw new TranslateError('RESOURCES_REQUIRED');
	} else if (!autoDetect && !locale) {
		throw new TranslateError('LOCALE_REQUIRED');
	}

	debug('New translator created: %s namespace(s)', namespaces.join(', '));

	const translator = createInstance().use(new FileBackend());

	if (autoDetect) {
		translator.use(new LocaleDetector());
	}

	void translator.init(
		{
			backend: {
				format: resourceFormat,
				paths: resourcePaths,
			},
			cleanCode: true,
			debug: debugOpt,
			defaultNS: namespaces[0],
			fallbackLng: fallbackLocale,
			initImmediate: false,
			lng: locale,
			load: lookupType,
			lowerCaseLng: false,
			ns: namespaces,
			returnEmptyString: true,
			returnNull: true,
		},
		handleError,
	);

	function msg(
		key: string[] | string,
		params?: InterpolationParams,
		{ interpolation, locale: lng, ...opts }: MessageOptions = {},
	): string {
		return translator.t(key, {
			interpolation: { escapeValue: false, ...interpolation },
			...opts,
			lng,
			replace: params,
		});
	}

	msg.direction = translator.dir();
	msg.locale = translator.language;

	msg.changeLocale = async (lang: Locale) => {
		debug('Locale manually changed to "%s"', lang);

		await translator.changeLanguage(lang);

		msg.direction = translator.dir();
		msg.locale = translator.language;
	};

	if (process.env.NODE_ENV === 'test') {
		msg.i18n = translator;
	}

	return msg;
}
