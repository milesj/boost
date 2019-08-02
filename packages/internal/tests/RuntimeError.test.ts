import RuntimeError from '../src/RuntimeError';

describe('RuntimeError', () => {
  it('loads a message for the defined module and code', () => {
    const error = new RuntimeError('internal', 'TEST_ERROR');

    expect(error.code).toBe('TEST_ERROR');
    expect(error.module).toBe('internal');
    expect(error.message).toBe('This error is only used for testing.');
  });

  it('returns an UNKNOWN_ERROR when a code does not exist', () => {
    const error = new RuntimeError('internal', 'INVALID_ERROR_CODE');

    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.module).toBe('internal');
    expect(error.message).toBe('An unknown error has occurred.');
  });
});
