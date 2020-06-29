import isAllowedLogLevel from '../../src/helpers/isAllowedLogLevel';

describe('isAllowedLogLevel()', () => {
  it('returns false for unknown level', () => {
    expect(
      isAllowedLogLevel(
        // @ts-expect-error
        'unknown',
        'log',
      ),
    ).toBe(false);
  });

  it('returns false for unknown max level', () => {
    expect(
      isAllowedLogLevel(
        'debug',
        // @ts-expect-error
        'unknown',
      ),
    ).toBe(true);
  });

  it('returns true for no max level', () => {
    expect(isAllowedLogLevel('debug')).toBe(true);
  });

  it('returns true if level is below max level', () => {
    expect(isAllowedLogLevel('debug', 'error')).toBe(true);
  });

  it('returns false if level is above max level', () => {
    expect(isAllowedLogLevel('error', 'debug')).toBe(false);
  });

  it('handles `log` max level', () => {
    const maxLevel = 'log';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(false);
  });

  it('handles `trace` max level', () => {
    const maxLevel = 'trace';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(false);
  });

  it('handles `debug` max level', () => {
    const maxLevel = 'debug';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(false);
  });

  it('handles `info` max level', () => {
    const maxLevel = 'info';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(false);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(false);
  });

  it('handles `warn` max level', () => {
    const maxLevel = 'warn';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(false);
  });

  it('handles `error` max level', () => {
    const maxLevel = 'error';

    expect(isAllowedLogLevel('log', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('trace', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('debug', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('info', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('warn', maxLevel)).toBe(true);
    expect(isAllowedLogLevel('error', maxLevel)).toBe(true);
  });
});
