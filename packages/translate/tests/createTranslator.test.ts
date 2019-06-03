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
});
