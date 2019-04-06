import Optionable from '../src/Optionable';
import { Predicates } from '../src';

describe('Optionable', () => {
  class OptionalProps extends Optionable<{ foo?: string; bar?: number }> {
    blueprint({ number, string }: Predicates) {
      return {
        foo: string('default'),
        bar: number(),
      };
    }
  }

  class RequiredProps extends Optionable<{ bar: number }> {
    // eslint-disable-next-line no-useless-constructor
    constructor(options: { bar: number }) {
      super(options);
    }

    blueprint({ number }: Predicates) {
      return {
        bar: number().required(),
      };
    }
  }

  describe('constructor()', () => {
    it('errors for invalid option type passed', () => {
      expect(
        () =>
          // @ts-ignore Allow invalid type
          new OptionalProps({
            foo: 123,
          }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors for unknown option', () => {
      expect(
        () =>
          new OptionalProps({
            // @ts-ignore Allow unknown
            unknown: 'abc',
          }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('sets options', () => {
      const opts = new OptionalProps({
        foo: 'custom',
      });

      expect(opts.options.foo).toBe('custom');
    });

    it('inherits option defaults', () => {
      const opts = new OptionalProps();

      expect(opts.options.foo).toBe('default');
    });

    it('requires non-optional options to be passed', () => {
      expect(
        () =>
          // @ts-ignore Allow missing prop
          new RequiredProps(),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('configure()', () => {
    it('can set an option', () => {
      const opts = new OptionalProps();

      expect(opts.options.foo).toBe('default');

      opts.configure({
        foo: 'new',
      });

      expect(opts.options.foo).toBe('new');
    });

    it('persists other options not being configured', () => {
      const opts = new OptionalProps({
        foo: 'abc',
        bar: 123,
      });

      expect(opts.options).toEqual({
        foo: 'abc',
        bar: 123,
      });

      opts.configure({
        bar: 456,
      });

      expect(opts.options).toEqual({
        foo: 'abc',
        bar: 456,
      });
    });
  });
});
