// TODO: Remove in v2
export default class SignalError extends Error {
  signal: NodeJS.Signals;

  constructor(message: string, signal: NodeJS.Signals) {
    super(message);

    this.signal = signal;
    this.name = 'SignalError';
  }
}
