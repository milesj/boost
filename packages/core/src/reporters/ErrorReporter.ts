import Reporter from '../Reporter';

export default class ErrorReporter extends Reporter {
  bootstrap() {
    super.bootstrap();

    this.console.on('error', this.handleError);
  }

  handleError = (error: Error) => {
    this.displayError(error);
  };
}
