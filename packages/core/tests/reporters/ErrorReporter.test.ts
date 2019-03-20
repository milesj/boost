import { mockTool, mockConsole } from '../../src/tests';
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
      const spy = jest.spyOn(reporter.console, 'on');

      reporter.bootstrap();

      expect(spy).toHaveBeenCalledWith('error', expect.anything());
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
