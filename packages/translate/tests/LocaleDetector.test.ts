import LocaleDetector from '../src/LocaleDetector';

jest.mock('os-locale', () => ({
  sync: () => 'en-us',
}));

describe('LocaleDetector', () => {
  const { argv } = process;
  let detector: LocaleDetector;

  beforeEach(() => {
    detector = new LocaleDetector();
    detector.locale = '';
  });

  afterEach(() => {
    process.argv = argv;
  });

  it('returns the locale explicitly defined', () => {
    detector.cacheUserLanguage('fr-fr');

    expect(detector.detect()).toBe('fr-fr');
  });

  it('returns the locale from argv', () => {
    process.argv = ['--locale', 'de'];

    expect(detector.detect()).toBe('de');
  });

  it('returns the locale from the OS', () => {
    expect(detector.detect()).toBe('en-us');
  });

  it('handles missing locale arg', () => {
    process.argv = [];

    expect(detector.detect()).toBe('en-us');
  });

  it('handles no locale arg value', () => {
    process.argv = ['--locale', '--foo'];

    expect(detector.detect()).toBe('en-us');
  });
});
