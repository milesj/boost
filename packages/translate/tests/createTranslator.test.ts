import i18next from 'i18next';
import { getFixturePath } from '@boost/test-utils';
import createTranslator from '../src/createTranslator';
import { Translator } from '../src/types';

declare global {
  interface Translator {
    i18n: i18next.i18n;
  }
}

describe('createTranslator()', () => {
  let translator: Translator;

  beforeEach(() => {
    translator = createTranslator('common', getFixturePath('i18n-resources'));
  });

  it('errors if no namespace is provided', () => {
    expect(() => {
      createTranslator([], []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if no resource paths are provided', () => {
    expect(() => {
      createTranslator('common', []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if `autoDetect` and `locale` are empty', () => {
    expect(() => {
      createTranslator('common', getFixturePath('i18n-resources'), { autoDetect: false });
    }).toThrowErrorMatchingSnapshot();
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
    expect(translator.dir).toBe('ltr');
    expect(translator.locale).toBe('en');
  });

  it('calls `t` on i18next instance', () => {
    const spy = jest.spyOn(translator.i18n, 't');

    expect(translator('missing', { foo: 'bar' }, { defaultValue: 'Hello' })).toBe('Hello');

    expect(spy).toHaveBeenCalledWith('missing', {
      defaultValue: 'Hello',
      interpolation: { escapeValue: false },
      lng: undefined,
      replace: { foo: 'bar' },
    });
  });

  describe('changeLocale()', () => {
    it('calls `changeLanguage` on i18next', () => {
      const spy = jest.spyOn(translator.i18n, 'changeLanguage');

      translator.changeLocale('ja');

      expect(spy).toHaveBeenCalledWith('ja', expect.anything());
    });

    it('updates `dir` and `locale`', () => {
      translator.changeLocale('ja');

      expect(translator.dir).toBe('ltr');
      expect(translator.locale).toBe('ja');
    });
  });
});
