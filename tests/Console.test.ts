import Console from '../src/Console';

describe('Console', () => {
  let cli: Console;

  beforeEach(() => {
    cli = new Console();
  });

  describe('handleFailure()', () => {
    it('calls exit with error', () => {
      const error = new Error('Oops');

      cli.exit = jest.fn();
      cli.handleFailure(error);

      expect(cli.exit).toHaveBeenCalledWith(error, 1, true);
    });
  });

  describe('handleSignal()', () => {
    it('calls exit with error', () => {
      cli.exit = jest.fn();
      cli.handleSignal();

      expect(cli.exit).toHaveBeenCalledWith('Process has been terminated.', 1, true);
    });
  });

  describe('exit()', () => {
    const oldExit = process.exit.bind(process);

    beforeEach(() => {
      // @ts-ignore
      process.exit = jest.fn();
      cli.on('stop', jest.fn());
      cli.emit = jest.fn();
    });

    afterEach(() => {
      process.exit = oldExit;
    });

    it('calls `stop` with null', done => {
      cli.exit(null, 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [null, 2]);
        done();
      });
    });

    it('calls `stop` with string', done => {
      cli.exit('Oops', 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [new Error('Oops'), 2]);
        done();
      });
    });

    it('calls `stop` with error', done => {
      const error = new Error('Oops');

      cli.exit(error, 2, true);

      process.nextTick(() => {
        expect(process.exit).toHaveBeenCalledWith(2);
        expect(cli.emit).toHaveBeenCalledWith('stop', [error, 2]);
        done();
      });
    });
  });
});
