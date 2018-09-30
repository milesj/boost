import ErrorReporter from '../../src/reporters/ErrorReporter';
import { createTestConsole, createTestTool } from '../helpers';

describe('ErrorReporter', () => {
  let reporter: ErrorReporter;

  beforeEach(() => {
    reporter = new ErrorReporter();
    reporter.console = createTestConsole();
    reporter.tool = createTestTool();
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
