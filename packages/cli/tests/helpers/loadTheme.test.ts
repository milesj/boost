import { env } from '@boost/internal';
import loadTheme from '../../src/helpers/loadTheme';

jest.mock(
  '@boost/theme-foo',
  () => ({
    default: 'white',
    failure: 'white',
    inverted: 'white',
    muted: 'white',
    success: 'white',
    warning: 'white',
  }),
  { virtual: true },
);

jest.mock(
  '@boost/theme-bar',
  () => ({
    default: 'black',
    failure: 'black',
    inverted: 'black',
    muted: 'black',
    success: 'black',
    warning: 'black',
  }),
  { virtual: true },
);

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
    env('CLI_THEME', 'foo');

    expect(loadTheme()).toEqual({
      default: 'white',
      failure: 'white',
      inverted: 'white',
      muted: 'white',
      success: 'white',
      warning: 'white',
    });
  });

  it('loads from `boost` scope', () => {
    env('CLI_THEME', 'bar');

    expect(loadTheme()).toEqual({
      default: 'black',
      failure: 'black',
      inverted: 'black',
      muted: 'black',
      success: 'black',
      warning: 'black',
    });
  });

  it('errors for missing module', () => {
    env('CLI_THEME', 'baz');

    expect(() => loadTheme()).toThrow(
      'Theme could not be loaded. Attempted `@boost/theme-baz` and `boost-theme-baz`. [CLI:THEME_UNKNOWN]',
    );
  });
});
