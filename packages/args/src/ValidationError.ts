export default class ValidationError extends Error {
  option: string;

  constructor(message: string, option: string = '') {
    super(message);

    this.name = 'ValidationError';
    this.option = option;
  }
}
