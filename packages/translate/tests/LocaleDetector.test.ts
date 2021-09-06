import osLocale from 'os-locale';
import { jest } from '@jest/globals';
import { LocaleDetector } from '../src/LocaleDetector';

describe('LocaleDetector', () => {
	const { argv } = process;
	let detector: LocaleDetector;

	beforeEach(() => {
		detector = new LocaleDetector();
		detector.locale = '';

		jest.spyOn(osLocale, 'sync').mockImplementation(() => 'en-US');
	});

	afterEach(() => {
		process.argv = argv;
	});

	it('returns the locale explicitly defined', () => {
		detector.cacheUserLanguage('fr-FR');

		expect(detector.detect()).toBe('fr-FR');
	});

	it('returns the locale from argv', () => {
		process.argv = ['--locale', 'de'];

		expect(detector.detect()).toBe('de');
	});

	it('returns the locale from the OS', () => {
		expect(detector.detect()).toBe('en-US');
	});

	it('handles missing locale arg', () => {
		process.argv = [];

		expect(detector.detect()).toBe('en-US');
	});

	it('handles no locale arg value', () => {
		process.argv = ['--locale', '--foo'];

		expect(detector.detect()).toBe('en-US');
	});
});
