import { env } from '@boost/internal';
import loadTheme from '../../src/helpers/loadTheme';

describe('loadTheme()', () => {
  beforeEach(() => {
    delete process.env.BOOSTJS_CLI_THEME;
  });

  it('returns default values if no theme', () => {
    expect(loadTheme()).toEqual({
      default: 'white',
      failure: 'red',
      inverted: 'black',
      muted: 'gray',
      success: 'green',
      warning: 'yellow',
    });
  });

  it('loads from `@boost` scope', () => {
    env('CLI_THEME', 'test-private');

    expect(loadTheme()).toEqual({
      default: 'private',
      failure: 'private',
      inverted: 'private',
      muted: 'private',
      success: 'private',
      warning: 'private',
    });
  });

  it('loads from `boost` scope', () => {
    env('CLI_THEME', 'test-public');

    expect(loadTheme()).toEqual({
      default: 'public',
      failure: 'public',
      inverted: 'public',
      muted: 'public',
      success: 'public',
      warning: 'public',
    });
  });

  it('errors for missing module', () => {
    env('CLI_THEME', 'baz');

    expect(() => loadTheme()).toThrow(
      'Theme could not be loaded. Attempted `@boost/theme-baz` and `boost-theme-baz`. [CLI:THEME_UNKNOWN]',
    );
  });
});
