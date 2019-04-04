import Reporter from '../Reporter';

export default class ErrorReporter extends Reporter {
  blueprint() {
    return {};
  }

  bootstrap() {
    super.bootstrap();

    this.console.onError.listen(this.handleError);
  }

  handleError = (error: Error) => {
    this.displayError(error);
  };
}
