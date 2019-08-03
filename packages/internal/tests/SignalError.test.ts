import SignalError from '../src/SignalError';

describe('SignalError', () => {
  it('sets the message and signal', () => {
    const error = new SignalError('Oops', 'SIGTERM');

    expect(error.message).toBe('Oops');
    expect(error.signal).toBe('SIGTERM');
  });
});
