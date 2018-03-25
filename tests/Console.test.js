import chalk from 'chalk';
import Console from '../src/Console';
import Reporter from '../src/Reporter';
import Task from '../src/Task';

describe('Console', () => {
  let cli;

  beforeEach(() => {
    cli = new Console(new Reporter());
  });

  describe('log()', () => {
    it('adds to output log', () => {
      cli.log('foo');

      expect(cli.logs).toEqual(['foo']);
    });

    it('supports formatting', () => {
      cli.log('%s', 'foo');

      expect(cli.logs).toEqual(['foo']);
    });

    it('handles objects and arrays', () => {
      cli.log('%o %O', { foo: 'bar' }, ['baz', 123]);

      expect(cli.logs).toMatchSnapshot();
    });
  });

  describe('error()', () => {
    it('adds to error log', () => {
      cli.error('foo');

      expect(cli.errors).toEqual(['foo']);
    });

    it('supports formatting', () => {
      cli.error('%s', 'foo');

      expect(cli.errors).toEqual(['foo']);
    });

    it('handles objects and arrays', () => {
      cli.error('%o %O', { foo: 'bar' }, ['baz', 123]);

      expect(cli.errors).toMatchSnapshot();
    });
  });

  describe('start()', () => {
    it('calls start on the reporter', () => {
      const spy = jest.fn();
      const task = new Task('Foo', () => {});

      cli.reporter.start = spy;
      cli.start({}, {}, [task]);

      expect(spy).toHaveBeenCalled();
    });

    it('passes value from tool and console', () => {
      jest.useFakeTimers();

      const task = new Task('Foo', () => {});

      cli.options = {
        footer: 'footer',
        header: 'header',
        silent: true,
      };

      cli.log('log');
      cli.error('error');
      cli.start([task]);

      expect(cli.reporter.loader()).toEqual({
        errors: ['error'],
        footer: 'footer',
        header: 'header',
        logs: ['log'],
        silent: true,
        tasks: [task],
      });

      jest.useRealTimers();
    });
  });

  describe('stop()', () => {
    it('calls stop on the reporter', () => {
      const spy = jest.fn();

      cli.reporter.stop = spy;
      cli.stop();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('calls update on the reporter', () => {
      const spy = jest.fn();

      cli.reporter.update = spy;
      cli.update();

      expect(spy).toHaveBeenCalled();
    });
  });
});
