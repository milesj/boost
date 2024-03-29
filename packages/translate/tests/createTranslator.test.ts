import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFixturePath } from '@boost/test-utils';
import { createTranslator } from '../src/createTranslator';
import type { Translator } from '../src/types';

describe('createTranslator()', () => {
	let translator: Translator;

	beforeEach(async () => {
		translator = await createTranslator('common', getFixturePath('i18n-resources'));
	});

	it('errors if no namespace is provided', async () => {
		await expect(createTranslator([], [])).rejects.toThrowErrorMatchingSnapshot();
	});

	it('errors if no resource paths are provided', async () => {
		await expect(createTranslator('common', [])).rejects.toThrowErrorMatchingSnapshot();
	});

	it('errors if `autoDetect` and `locale` are empty', async () => {
		await expect(
			createTranslator('common', getFixturePath('i18n-resources'), { autoDetect: false }),
		).rejects.toThrowErrorMatchingSnapshot();
	});

	it('returns a function to load translated messages', () => {
		expect(typeof translator).toBe('function');
		expect(translator('common:key')).toBe('value');
	});

	it('returns a message at the defined key', () => {
		expect(translator('common:key')).toBe('value');
	});

	it('sets primary namespace', () => {
		expect(translator('key')).toBe('value');
	});

	it('handles array of keys', () => {
		expect(translator(['unknown', 'key'])).toBe('value');
	});

	it('sets `dir` and `locale`', () => {
		expect(translator.direction).toBe('ltr');
		expect(translator.locale).toBe('en');
	});

	it('calls `t` on i18next instance', () => {
		const spy = vi.spyOn(translator.i18n, 't');

		expect(translator('missing', { foo: 'bar' }, { defaultValue: 'Hello' })).toBe('Hello');

		expect(spy).toHaveBeenCalledWith('missing', {
			defaultValue: 'Hello',
			interpolation: { escapeValue: false },
			lng: undefined,
			replace: { foo: 'bar' },
		});
	});

	describe('msg()', () => {
		beforeEach(async () => {
			translator = await createTranslator('common', [
				getFixturePath('i18n-resources'),
				getFixturePath('i18n-resources-more'),
			]);
		});

		it('merges objects from multiple resource paths', () => {
			expect(translator('common:lang')).toBe('en');
			expect(translator('common:region')).toBe('region'); // MISSING
		});

		it('supports locale with region', async () => {
			await translator.changeLocale('en-US');

			expect(translator('common:lang')).toBe('en');
			expect(translator('common:region')).toBe('us');
		});
	});

	describe('changeLocale()', () => {
		it('calls `changeLanguage` on i18next', async () => {
			const spy = vi.spyOn(translator.i18n, 'changeLanguage');

			await translator.changeLocale('ja');

			expect(spy).toHaveBeenCalledWith('ja');
		});

		it('updates `dir` and `locale`', async () => {
			await translator.changeLocale('ja');

			expect(translator.direction).toBe('ltr');
			expect(translator.locale).toBe('ja');
		});
	});
});
