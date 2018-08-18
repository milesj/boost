import ErrorReporter from '../../src/reporters/ErrorReporter';
import Console from '../../src/Console';
import { DEFAULT_CONSOLE_OPTIONS } from '../helpers';

jest.mock('../../src/Console');

describe('ErrorReporter', () => {
  let reporter: ErrorReporter;

  beforeEach(() => {
    reporter = new ErrorReporter();
    reporter.console = new Console();
    reporter.console.options = { ...DEFAULT_CONSOLE_OPTIONS };
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
