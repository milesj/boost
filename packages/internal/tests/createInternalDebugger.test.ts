import createInternalDebugger from '../src/createInternalDebugger';

describe('createInternalDebugger()', () => {
  it('returns a `debug` instance', () => {
    const debug = createInternalDebugger('foo');

    expect(typeof debug).toBe('function');
    expect(debug.namespace).toBe('boost:foo');
  });
});
