export default class ParseError extends Error {
  arg: string;

  constructor(message: string, arg: string = '') {
    super(message);

    this.name = 'ParseError';
    this.arg = arg;
  }
}
