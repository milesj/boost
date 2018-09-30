import LanguageDetector from '../../src/i18n/LanguageDetector';

describe('LanguageDetector', () => {
  it('detects the OS locale', () => {
    const detector = new LanguageDetector();

    expect(detector.detect()).toBe('en-us');
  });
});
