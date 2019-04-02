import { mockTool, mockConsole } from '../../src/testUtils';
import ErrorReporter from '../../src/reporters/ErrorReporter';

describe('ErrorReporter', () => {
  let reporter: ErrorReporter;

  beforeEach(() => {
    const tool = mockTool();

    reporter = new ErrorReporter();
    reporter.console = mockConsole(tool);
    reporter.tool = tool;
  });

  describe('bootstrap()', () => {
    it('binds events', () => {
      const errorSpy = jest.spyOn(reporter.console.onError, 'listen');

      reporter.bootstrap();

      expect(errorSpy).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('handleError()', () => {
    it('displays the error', () => {
      const spy = jest.spyOn(reporter, 'displayError');
      const error = new Error('Oops');

      reporter.handleError(error);

      expect(spy).toHaveBeenCalledWith(error);
    });
  });
});
