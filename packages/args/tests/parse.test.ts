import { parse, ParseError, ValidationError, Flag } from '../src';
import {
  optConfig,
  optConfigExpanded,
  optsConfig,
  optsConfigExpanded,
  optsConfigArity,
  flagConfig,
  numConfig,
  numConfigExpanded,
  numsConfig,
  SPECIAL_CHARS,
  SPECIAL_NUMBERS,
} from './__mocks__/options';

describe('parse()', () => {
  it('supports camel case option names by default', () => {
    const result = parse<{ fooBar: string }>(['--fooBar', 'baz'], {
      options: {
        fooBar: {
          description: '',
          type: 'string',
        },
      },
    });

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {
        fooBar: 'baz',
      },
      params: [],
      rest: [],
      unknown: {},
    });
  });

  it('converts dashed option names to camel case', () => {
    const result = parse<{ fooBar: string }>(['--foo-bar', 'baz'], {
      options: {
        fooBar: {
          description: '',
          type: 'string',
        },
      },
    });

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {
        fooBar: 'baz',
      },
      params: [],
      rest: [],
      unknown: {},
    });
  });

  it('supports numbers in option name', () => {
    const result = parse<{ foo123: string; bar456: string }>(
      ['--foo123', 'val1', '--bar-456', 'val2'],
      {
        options: {
          foo123: optConfig,
          bar456: optConfig,
        },
      },
    );

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {
        foo123: 'val1',
        bar456: 'val2',
      },
      params: [],
      rest: [],
      unknown: {},
    });
  });

  it('captures all rest arguments after `--`', () => {
    const result = parse<{ flag: boolean }>(['--flag', '--', '--foo', '-B', 'baz'], {
      options: {
        flag: {
          description: '',
          type: 'boolean',
        },
      },
    });

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {
        flag: true,
      },
      params: [],
      rest: ['--foo', '-B', 'baz'],
      unknown: {},
    });
  });

  it('captures bare arguments as params', () => {
    const result = parse(['foo', 'bar', 'baz'], { options: {} });

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {},
      params: ['foo', 'bar', 'baz'],
      rest: [],
      unknown: {},
    });
  });

  describe('options', () => {
    describe('single', () => {
      it('sets value from next subsequent arg', () => {
        const result = parse<{ opt: string }>(['--opt', 'foo'], {
          options: {
            opt: optConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foo',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('sets value from right hand side of `=` (inline value)', () => {
        const result = parse<{ opt: string }>(['--opt=foo'], {
          options: {
            opt: optConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foo',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('only captures the next subsequent arg', () => {
        const result = parse<{ opt: string }>(['--opt', 'foo', 'bar'], {
          options: {
            opt: optConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foo',
          },
          params: ['bar'],
          rest: [],
          unknown: {},
        });
      });

      it('uses default value if no subsequent arg passed', () => {
        const result = parse<{ opt: string }>(['--opt'], {
          options: {
            opt: optConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foobar',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('subsequent options of the same name override previous value', () => {
        const result = parse<{ opt: string }>(['--opt', 'foo', '--opt', 'bar', '--opt', 'baz'], {
          options: {
            opt: optConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'baz',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('runs custom validation using `validate`', () => {
        const result = parse<{ opt: string }>(['--opt', '2019-01'], {
          options: {
            opt: {
              ...optConfigExpanded,
              validate(value) {
                if (!value.match(/^\d{4}-\d{2}-\d{2}$/u)) {
                  throw new Error('Invalid date.');
                }
              },
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [new ValidationError('Invalid date.', 'opt')],
          options: {
            opt: '2019-01',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('single - choices', () => {
      it('errors when an invalid choice value is used', () => {
        const result = parse<{ opt: string }>(['--opt', 'qux'], {
          options: {
            opt: {
              choices: ['foo', 'bar', 'baz'],
              description: '',
              type: 'string',
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ValidationError(
              'Invalid value, must be one of foo, bar, baz, found qux. [ARG:VALUE_INVALID_CHOICE]',
              'opt',
            ),
          ],
          options: {
            opt: 'qux',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('single - count', () => {
      it('errors when a non-number uses the `count` setting', () => {
        const result = parse<{ opt: string }>([], {
          options: {
            opt: {
              // @ts-expect-error
              count: true,
              description: '',
              type: 'string',
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ValidationError(
              'Only numeric options may use the `count` setting. [ARG:OPTION_INVALID_COUNT_TYPE]',
              'opt',
            ),
          ],
          options: {
            opt: '',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('errors when passed in a group but not `count` enabled', () => {
        const result = parse<{ flag: boolean; num: number }>(['-Fn'], {
          options: {
            flag: flagConfig,
            num: numConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ParseError(
              'Numeric options must have `count` enabled when passed in a short option group. [ARG:GROUP_REQUIRED_COUNT]',
              '-Fn',
              0,
            ),
          ],
          options: {
            flag: true,
            num: 123,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('increments count for each occurrence of a short name', () => {
        const result = parse<{ flag: boolean; num: number }>(['-nnnn'], {
          options: {
            flag: flagConfig,
            num: {
              ...numConfigExpanded,
              default: 0,
              count: true,
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: false,
            num: 4,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('can interweave other short options and still increment', () => {
        const result = parse<{ flag: boolean; num: number }>(['-nFnn'], {
          options: {
            flag: flagConfig,
            num: {
              ...numConfigExpanded,
              default: 0,
              count: true,
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: true,
            num: 3,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('sets value if using the long form', () => {
        const result = parse<{ flag: boolean; num: number }>(['--num', '3', 'other value'], {
          options: {
            flag: flagConfig,
            num: {
              ...numConfigExpanded,
              default: 0,
              count: true,
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: false,
            num: 3,
          },
          params: ['other value'],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('multiple', () => {
      it('sets multiple values until next option is found', () => {
        const result = parse<{ flag: boolean; opts: string[] }>(
          ['--opts', 'foo', 'bar', '--flag', 'baz'],
          {
            options: {
              flag: flagConfig,
              opts: optsConfig,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: true,
            opts: ['foo', 'bar'],
          },
          params: ['baz'],
          rest: [],
          unknown: {},
        });
      });

      it('sets multiple values from separate options of the same name', () => {
        const result = parse<{ opts: string[] }>(
          ['arg', '--opts', 'foo', '--opts', 'bar', '--opts', 'baz'],
          {
            options: {
              opts: optsConfigExpanded,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['foo', 'bar', 'baz'],
          },
          params: ['arg'],
          rest: [],
          unknown: {},
        });
      });

      it('sets multiple inline values from separate options of the same name', () => {
        const result = parse<{ opts: string[] }>(
          ['arg', '--opts=foo', '--opts=bar', '--opts=baz'],
          {
            options: {
              opts: optsConfigExpanded,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['foo', 'bar', 'baz'],
          },
          params: ['arg'],
          rest: [],
          unknown: {},
        });
      });

      it('sets multiple values using all patterns', () => {
        const result = parse<{ flag: boolean; opts: string[] }>(
          ['--opts', 'foo', '--opts=bar', '--flag', '-s', 'baz', '-s=qux'],
          {
            options: {
              flag: flagConfig,
              opts: optsConfigExpanded,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: true,
            opts: ['foo', 'bar', 'baz', 'qux'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('sets initial inline value and captures subsequent values', () => {
        const result = parse<{ flag: boolean; opts: string[] }>(
          ['--opts=foo', 'bar', 'baz', '--flag'],
          {
            options: {
              flag: flagConfig,
              opts: optsConfigExpanded,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            flag: true,
            opts: ['foo', 'bar', 'baz'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('sets default value to an empty array if `default` not defined', () => {
        const result = parse<{ opts: string[] }>([], {
          options: {
            opts: {
              description: '',
              multiple: true,
              type: 'string',
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: [],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('inherits default value when nothing passed', () => {
        const result = parse<{ opts: string[] }>([], {
          options: {
            opts: optsConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['qux'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('overwrites default value if a value is passed', () => {
        const result = parse<{ opts: string[] }>(['--opts', 'baz'], {
          options: {
            opts: optsConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['baz'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('doesnt unique or flatten duplicates', () => {
        const result = parse<{ opts: string[] }>(['-s=foo', 'foo', 'foo'], {
          options: {
            opts: optsConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['foo', 'foo', 'foo'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('runs custom validation using `validate`', () => {
        const result = parse<{ nums: number[] }>(['--nums', '1', '5', '10'], {
          options: {
            nums: {
              ...numsConfig,
              validate(value) {
                if (!value.every((val) => val >= 5)) {
                  throw new Error('All values must be >= 5.');
                }
              },
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [new ValidationError('All values must be >= 5.', 'num')],
          options: {
            nums: [1, 5, 10],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('multiple - arity', () => {
      it('captures values up until the arity count', () => {
        const result = parse<{ opts: string[] }>(['--opts', 'foo', 'bar', 'baz'], {
          options: {
            opts: optsConfigArity,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['foo', 'bar'],
          },
          params: ['baz'],
          rest: [],
          unknown: {},
        });
      });

      it('works with short names and inline values', () => {
        const result = parse<{ opts: string[] }>(['-s', 'foo', '-s=bar', 'baz'], {
          options: {
            opts: optsConfigArity,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: ['foo', 'bar'],
          },
          params: ['baz'],
          rest: [],
          unknown: {},
        });
      });

      it('supports multiple arity options', () => {
        const result = parse<{ ars: number[]; opts: string[] }>(
          ['-s', 'foo', '--ars', '123', '456', '--opts=qux'],
          {
            options: {
              ars: { default: [], description: '', multiple: true, short: 'a', type: 'number' },
              opts: optsConfigArity,
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            ars: [123, 456],
            opts: ['foo', 'qux'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('errors if not enough values are captured', () => {
        const result = parse<{ opts: string[] }>(['--opts', 'foo'], {
          options: {
            opts: optsConfigArity,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ValidationError(
              'Not enough arity arguments. Require 2, found 1. [ARG:VALUE_INVALID_ARITY]',
              'opts',
            ),
          ],
          options: {
            opts: ['foo'],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('doesnt error if no values but arity is enabled', () => {
        const result = parse<{ opts: string[] }>([], {
          options: {
            opts: optsConfigArity,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opts: [],
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('short names', () => {
      it('expands short name and sets value', () => {
        const result = parse<{ opt: string }>(['-O', 'foo'], {
          options: {
            opt: optConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foo',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('expands short name and sets inline value', () => {
        const result = parse<{ opt: string }>(['-O=foo'], {
          options: {
            opt: optConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: 'foo',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('sets multiple short names correctly', () => {
        const result = parse<{ host: string; opt: string; port: number }>(
          ['-O', 'foo', '-h', '127.0.0.1', '-p', '1337'],
          {
            options: {
              host: {
                description: '',
                short: 'h',
                type: 'string',
              },
              opt: optConfigExpanded,
              port: {
                description: '',
                short: 'p',
                type: 'number',
              },
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            host: '127.0.0.1',
            opt: 'foo',
            port: 1337,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('expands short option group and sets all to truthy', () => {
        const baseConfig: Flag = {
          default: false,
          description: '',
          type: 'boolean',
        };

        const result = parse<{ foo: boolean; bar: boolean; baz: boolean; qux: boolean }>(
          ['random', '-ZqF', 'arg'],
          {
            options: {
              bar: { ...baseConfig, short: 'b' },
              baz: { ...baseConfig, short: 'Z' },
              foo: { ...baseConfig, short: 'F' },
              qux: { ...baseConfig, short: 'q' },
            },
          },
        );

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            bar: false,
            baz: true,
            foo: true,
            qux: true,
          },
          params: ['random', 'arg'],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('short groups', () => {
      it('errors when a string type is used', () => {
        const result = parse<{ flag: boolean; opt: string }>(['-OF'], {
          options: {
            flag: flagConfig,
            opt: optConfigExpanded,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ParseError(
              'Only boolean and countable number options may be used in a short option group. [ARG:GROUP_UNSUPPORTED_TYPE]',
              '-OF',
              0,
            ),
          ],
          options: {
            flag: false,
            opt: 'foobar',
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });
  });

  describe('string options', () => {
    it('inherits default value when nothing passed', () => {
      const result = parse<{ opt: string }>([], {
        options: {
          opt: optConfigExpanded,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: 'foobar',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets to empty string when `default` not defined', () => {
      const result = parse<{ opt: string }>([], {
        options: {
          opt: optConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: '',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('supports newlines in string', () => {
      const result = parse<{ opt: string }>(['--opt', 'foo\nbar'], {
        options: {
          opt: optConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: 'foo\nbar',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('supports other whitespace characters in string', () => {
      const result = parse<{ opt: string }>(['--opt', 'foo\tbar baz'], {
        options: {
          opt: optConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: 'foo\tbar baz',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('should not convert number like strings to numbers', () => {
      const result = parse<{ opt: string }>(['--opt', '123456'], {
        options: {
          opt: optConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: '123456',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    SPECIAL_CHARS.forEach((char) => {
      it(`supports "${char}"`, () => {
        const result = parse<{ opt: string }>(['--opt', char], {
          options: {
            opt: optConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: char,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it(`supports "${char}" when using an inline value`, () => {
        const result = parse<{ opt: string }>([`--opt=${char}`], {
          options: {
            opt: optConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            opt: char,
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    it('supports capturing multiples of all special chars', () => {
      const result = parse<{ opts: string[] }>(['--opts', ...SPECIAL_CHARS], {
        options: {
          opts: optsConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opts: SPECIAL_CHARS,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets value based on a list of choices', () => {
      const result = parse<{ opt: string }>(['--opt', 'baz'], {
        options: {
          opt: {
            choices: ['foo', 'bar', 'baz'],
            description: '',
            type: 'string',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: 'baz',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('supports unions with choices', () => {
      const result = parse<{ modules: 'cjs' | 'esm' | 'umd' }>(['--modules', 'umd'], {
        options: {
          modules: {
            choices: ['cjs', 'esm', 'umd'] as 'esm'[],
            default: 'esm',
            description: 'Choose module output',
            type: 'string',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          modules: 'umd',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('number options', () => {
    it('inherits default value when nothing passed', () => {
      const result = parse<{ num: number }>([], {
        options: {
          num: numConfigExpanded,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: 123,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets to zero when `default` not defined', () => {
      const result = parse<{ num: number }>([], {
        options: {
          num: numConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: 0,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets to zero when option passed is an invalid number', () => {
      const result = parse<{ num: number }>(['--num', 'foo'], {
        options: {
          num: numConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: 0,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets value when option is passed', () => {
      const result = parse<{ num: number }>(['--num', '123'], {
        options: {
          num: numConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: 123,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets value when option is passed and is using inline value', () => {
      const result = parse<{ num: number }>(['--num=123'], {
        options: {
          num: numConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: 123,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets value based on a list of choices', () => {
      const result = parse<{ opt: number }>(['--opt', '2'], {
        options: {
          opt: {
            choices: [1, 2, 3],
            description: '',
            type: 'number',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          opt: 2,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    SPECIAL_NUMBERS.forEach((char) => {
      it(`supports "${char}"`, () => {
        const result = parse<{ num: number }>(['--num', char], {
          options: {
            num: numConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            num: Number(char),
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it(`supports "${char}" when using an inline value`, () => {
        const result = parse<{ num: number }>([`--num=${char}`], {
          options: {
            num: numConfig,
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {
            num: Number(char),
          },
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    it('supports capturing multiples of all special numbers', () => {
      const result = parse<{ nums: number[] }>(['--nums', ...SPECIAL_NUMBERS], {
        options: {
          nums: numsConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          nums: SPECIAL_NUMBERS.map((no) => Number(no)),
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('converts `Number.MAX_SAFE_INTEGER` to a number', () => {
      const result = parse<{ num: number }>(['--num', String(Number.MAX_SAFE_INTEGER)], {
        options: {
          num: numConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          num: Number.MAX_SAFE_INTEGER,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('flags', () => {
    it('inherits default value when nothing passed', () => {
      const result = parse<{ flag: boolean }>([], {
        options: {
          flag: {
            default: true,
            description: '',
            type: 'boolean',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: true,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets to `false` when `default` not defined', () => {
      const result = parse<{ flag: boolean }>([], {
        options: {
          flag: {
            description: '',
            type: 'boolean',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: false,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('sets to `true` when option passed', () => {
      const result = parse<{ flag: boolean }>(['--flag'], {
        options: {
          flag: flagConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: true,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('ignores inline value', () => {
      const result = parse<{ flag: boolean }>(['--flag=123'], {
        options: {
          flag: flagConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Flags and short option groups may not use inline values. [ARG:VALUE_NO_INLINE]',
            '--flag=123',
            0,
          ),
        ],
        options: {
          flag: true,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('negates value when option starts with `no-`', () => {
      const result = parse<{ flag: boolean }>(['--flag', '--no-flag'], {
        options: {
          flag: flagConfig,
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: false,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('expands short name', () => {
      const result = parse<{ flag: boolean }>(['-F'], {
        options: {
          flag: {
            ...flagConfig,
            short: 'F',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: true,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('commands', () => {
    it('sets as a param if no commands defined', () => {
      const result = parse<{}>(['cmd', 'foo', 'bar'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['cmd', 'foo', 'bar'],
        rest: [],
        unknown: {},
      });
    });

    describe('array', () => {
      it('sets as a command if defined', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('sets as a command if defined and using sub-commands', () => {
        const result = parse<{}>(['command:sub', 'foo', 'bar'], {
          commands: ['cmd', 'command', 'command:sub'],
          options: {},
        });

        expect(result).toEqual({
          command: ['command', 'sub'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('sets any sub-command depth', () => {
        const result = parse<{}>(['cmd:sub:deep', 'foo', 'bar'], {
          commands: ['cmd:sub:deep'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd', 'sub', 'deep'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if same command found multiple times', () => {
        const result = parse<{}>(['cmd', 'foo', 'cmd', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "cmd". [ARG:COMMAND_PROVIDED]',
              'cmd',
              2,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if multiple commands are passed', () => {
        const result = parse<{}>(['cmd', 'foo', 'command', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "command". [ARG:COMMAND_PROVIDED]',
              'command',
              2,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if command is passed after params', () => {
        const result = parse<{}>(['foo', 'cmd', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command must be passed as the first non-option, non-param argument. [ARG:COMMAND_NOT_FIRST]',
              'cmd',
              1,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if command has an invalid format', () => {
        const result = parse<{}>([], {
          commands: ['comm_and'],
          options: {},
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ValidationError(
              'Invalid "comm_and" command format. Must be letters, numbers, and dashes. [ARG:COMMAND_INVALID_FORMAT]',
            ),
          ],
          options: {},
          params: [],
          rest: [],
          unknown: {},
        });
      });
    });

    describe('function', () => {
      it('sets as a command if valid', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands: (arg) => arg === 'cmd',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('doesnt set as a command if invalid', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands: (arg) => arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {},
          params: ['cmd', 'foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('can validate sub-commands', () => {
        function commands(arg: string): boolean {
          const [main, sub] = arg.split(':');

          // eslint-disable-next-line jest/no-if
          if (main !== 'cmd') {
            return false;
          }

          return !sub || sub === 'one' || sub === 'two';
        }

        const resultNoSub = parse<{}>(['cmd', 'foo', 'bar'], {
          commands,
          options: {},
        });

        expect(resultNoSub).toEqual({
          command: ['cmd'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });

        const resultValidSub = parse<{}>(['cmd:one', 'foo', 'bar'], {
          commands,
          options: {},
        });

        expect(resultValidSub).toEqual({
          command: ['cmd', 'one'],
          errors: [],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });

        const resultInvalidSub = parse<{}>(['cmd:three', 'foo', 'bar'], {
          commands,
          options: {},
        });

        expect(resultInvalidSub).toEqual({
          command: [],
          errors: [],
          options: {},
          params: ['cmd:three', 'foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('can throw errors for invalid commands', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands() {
            throw new Error('Invalid');
          },
          options: {},
        });

        expect(result).toEqual({
          command: [],
          errors: [
            new ValidationError('Invalid'), // cmd
            new ValidationError('Invalid'), // foo
            new ValidationError('Invalid'), // bar
          ],
          options: {},
          params: [],
          rest: [],
          unknown: {},
        });
      });

      it('errors if same command found multiple times', () => {
        const result = parse<{}>(['cmd', 'foo', 'cmd', 'bar'], {
          commands: (arg) => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "cmd". [ARG:COMMAND_PROVIDED]',
              'cmd',
              2,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if multiple commands are passed', () => {
        const result = parse<{}>(['cmd', 'foo', 'command', 'bar'], {
          commands: (arg) => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "command". [ARG:COMMAND_PROVIDED]',
              'command',
              2,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });

      it('errors if command is passed after params', () => {
        const result = parse<{}>(['foo', 'cmd', 'bar'], {
          commands: (arg) => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command must be passed as the first non-option, non-param argument. [ARG:COMMAND_NOT_FIRST]',
              'cmd',
              1,
            ),
          ],
          options: {},
          params: ['foo', 'bar'],
          rest: [],
          unknown: {},
        });
      });
    });
  });

  describe('params', () => {
    it('errors if a required param comes after an optional', () => {
      const result = parse<{}, [string, string]>(['foo', 'bar'], {
        options: {},
        params: [
          { description: '', label: 'first', required: false, type: 'string' },
          { description: '', label: 'second', required: true, type: 'string' },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Optional param(s) "first" found before required param "second". Required must be first. [ARG:PARAM_INVALID_ORDER]',
          ),
        ],
        options: {},
        params: ['foo', 'bar'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if a required param is undefined', () => {
      const result = parse<{}, [string]>([], {
        options: {},
        params: [{ description: '', label: 'first', required: true, type: 'string' }],
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Param "first" is required but value is undefined. [ARG:PARAM_REQUIRED]',
          ),
        ],
        options: {},
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors if a required param has a default value', () => {
      const result = parse<{}, [string]>(['foo'], {
        options: {},
        params: [
          { default: 'foo', description: '', label: 'first', required: true, type: 'string' },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Required param "first" has a default value, which is not allowed. [ARG:PARAM_REQUIRED_NO_DEFAULT]',
          ),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });

    it('casts to value if a config exists, otherwise is a string', () => {
      const result = parse<{}, [number]>(['123', 'bar'], {
        options: {},
        params: [{ description: '', label: 'first', type: 'number' }],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: [123, 'bar'],
        rest: [],
        unknown: {},
      });
    });

    it('casts to boolean using keywords', () => {
      const result = parse<{}, [boolean, string, boolean]>(['off', 'bar', 'on'], {
        options: {},
        params: [
          { description: '', label: 'first', type: 'boolean' },
          { description: '', label: 'second', type: 'string' },
          { description: '', label: 'third', type: 'boolean' },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: [false, 'bar', true],
        rest: [],
        unknown: {},
      });
    });

    it('runs custom validation using `validate`', () => {
      const result = parse<{}, [string]>(['2019-01'], {
        options: {},
        params: [
          {
            description: '',
            label: 'date',
            type: 'string',
            validate(value) {
              if (!value.match(/^\d{4}-\d{2}-\d{2}$/u)) {
                throw new Error('Invalid date.');
              }
            },
          },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [new ValidationError('Invalid date.')],
        options: {},
        params: ['2019-01'],
        rest: [],
        unknown: {},
      });
    });

    it('fills in missing params with a default value', () => {
      const result = parse<{}, [string, string, boolean, string, number]>(['test'], {
        options: {},
        params: [
          { description: '', label: 'first', type: 'string', required: true },
          { description: '', label: 'second', type: 'string', default: 'a' },
          { description: '', label: 'third', type: 'boolean', default: true },
          { description: '', label: 'fourth', type: 'string' },
          { description: '', label: 'fifth', type: 'number', default: 123 },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['test', 'a', true, '', 123],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('variadic params', () => {
    it('errors if a non-configured param is passed', () => {
      const result = parse<{}, [string]>(['foo', 'bar'], {
        options: {},
        params: [{ description: '', label: 'first', required: false, type: 'string' }],
        variadic: false,
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown param "bar" found. Variadic params are not supported. [ARG:PARAM_UNKNOWN]',
            'bar',
            1,
          ),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('validations', () => {
    it('errors if boolean default value is not boolean', () => {
      const result = parse<{ foo: boolean }>([], {
        options: {
          foo: {
            description: '',
            type: 'boolean',
            // @ts-expect-error
            default: 123,
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is set to boolean, but non-boolean default value found. [ARG:VALUE_NON_BOOL]',
          ),
        ],
        options: {
          foo: false,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors if string default value is not string', () => {
      const result = parse<{ foo: string }>([], {
        options: {
          foo: {
            description: '',
            type: 'string',
            // @ts-expect-error
            default: 123,
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is set to string, but non-string default value found. [ARG:VALUE_NON_STRING]',
          ),
        ],
        options: {
          foo: '123',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors if number default value is not number', () => {
      const result = parse<{ foo: number }>([], {
        options: {
          foo: {
            description: '',
            type: 'number',
            // @ts-expect-error
            default: 'abc',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is set to number, but non-number default value found. [ARG:VALUE_NON_NUMBER]',
          ),
        ],
        options: {
          foo: 0,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors if multiple default value is not an array', () => {
      const result = parse<{ foo: number[] }>([], {
        options: {
          foo: {
            description: '',
            multiple: true,
            type: 'number',
            // @ts-expect-error
            default: 'abc',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is enabled for multiple values, but non-array default value found. [ARG:VALUE_NON_ARRAY]',
          ),
        ],
        options: {
          foo: [],
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors if short name is not 1 character', () => {
      const result = parse<{ foo: string }>([], {
        options: {
          foo: {
            description: '',
            type: 'string',
            // @ts-expect-error
            short: 'ab',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Short option "ab" may only be a single letter. [ARG:SHORT_INVALID_CHAR]',
          ),
        ],
        options: {
          foo: '',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('errors for duplicate short names', () => {
      const result = parse<{ foo: string; bar: string }>([], {
        options: {
          foo: {
            description: '',
            type: 'string',
            short: 'a',
          },
          bar: {
            description: '',
            type: 'string',
            short: 'a',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Short option "a" has already been defined for "foo". [ARG:SHORT_DEFINED]',
          ),
        ],
        options: {
          bar: '',
          foo: '',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });
  });

  describe('unknown options', () => {
    it('errors if an unknown option with value is provided', () => {
      const result = parse<{ known: boolean }>(['foo', '--unknown', 'value'], {
        options: {
          known: {
            description: 'Test for did you mean',
            type: 'boolean',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown option "--unknown" found. Did you mean "known"? [ARG:OPTION_UNKNOWN_MORE]',
            '--unknown',
            1,
          ),
        ],
        options: { known: false },
        params: ['foo', 'value'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if an unknown option with inline value is provided', () => {
      const result = parse(['foo', '--unknown=value'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown option "--unknown=value" found. [ARG:OPTION_UNKNOWN]',
            '--unknown=value',
            1,
          ),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if an unknown option with no value is provided', () => {
      const result = parse(['foo', '--unknown'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError('Unknown option "--unknown" found. [ARG:OPTION_UNKNOWN]', '--unknown', 1),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if an unknown short option with value is provided', () => {
      const result = parse(['foo', '-U', 'value'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown short option "U". No associated long option found. [ARG:SHORT_UNKNOWN]',
            '-U',
            1,
          ),
        ],
        options: {},
        params: ['foo', 'value'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if an unknown short option with inline value is provided', () => {
      const result = parse(['foo', '-U=value'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown short option "U". No associated long option found. [ARG:SHORT_UNKNOWN]',
            '-U',
            1,
          ),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });

    it('errors if an unknown short option with no value is provided', () => {
      const result = parse(['foo', '-U'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Unknown short option "U". No associated long option found. [ARG:SHORT_UNKNOWN]',
            '-U',
            1,
          ),
        ],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {},
      });
    });

    it('handles unknown option with value when `unknown` is true', () => {
      const result = parse(['foo', '--unknown', 'value'], {
        options: {},
        unknown: true,
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {
          unknown: 'value',
        },
      });
    });

    it('handles unknown option with inline value when `unknown` is true', () => {
      const result = parse(['foo', '--unknown=value'], {
        options: {},
        unknown: true,
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {
          unknown: 'value',
        },
      });
    });

    it('handles unknown option with no value when `unknown` is true', () => {
      const result = parse(['foo', '--unknown'], {
        options: {},
        unknown: true,
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['foo'],
        rest: [],
        unknown: {
          unknown: '',
        },
      });
    });
  });

  describe('formatting', () => {
    it('errors if types change because of formatting', () => {
      const result = parse<{ foo: string }>(['--foo', 'bar'], {
        options: {
          foo: {
            description: '',
            // @ts-expect-error
            format: () => 123,
            type: 'string',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ParseError(
            'Value was formatted to an invalid type. Expected string, found number. [ARG:VALUE_INVALID_FORMAT]',
            'bar',
            1,
          ),
        ],
        options: {
          foo: '',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('can change string option value', () => {
      const result = parse<{ amount: string }>(['--amount', '123456'], {
        options: {
          amount: {
            description: '',
            format: (value) => `$${Number(value).toLocaleString()}`,
            type: 'string',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          amount: '$123,456',
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('can change string list option value', () => {
      const result = parse<{ value: string[] }>(['--value', 'a', 'b', 'c'], {
        options: {
          value: {
            description: '',
            format: (value) => value.map((v) => v.toUpperCase()),
            multiple: true,
            type: 'string',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          value: ['A', 'B', 'C'],
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('can change string param value', () => {
      const result = parse<{}, [string]>(['123456'], {
        options: {},
        params: [
          {
            description: '',
            format: (value) => `$${Number(value).toLocaleString()}`,
            type: 'string',
          },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: ['$123,456'],
        rest: [],
        unknown: {},
      });
    });

    it('can change number option value', () => {
      const result = parse<{ amount: number }>(['--amount', '123'], {
        options: {
          amount: {
            description: '',
            format: (value) => value * 2,
            type: 'number',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          amount: 246,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('can change number list option value', () => {
      const result = parse<{ value: number[] }>(['--value', '1', '2', '3'], {
        options: {
          value: {
            description: '',
            format: (value) => value.map((v) => v * 2),
            multiple: true,
            type: 'number',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          value: [2, 4, 6],
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });

    it('can change number param value', () => {
      const result = parse<{}, [number]>(['123'], {
        options: {},
        params: [
          {
            description: '',
            format: (value) => value * 2,
            type: 'number',
          },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        params: [246],
        rest: [],
        unknown: {},
      });
    });

    it('cannot change boolean option value', () => {
      const result = parse<{ flag: boolean }>(['--flag'], {
        options: {
          flag: {
            description: '',
            // @ts-expect-error
            format: () => 123,
            type: 'boolean',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {
          flag: true,
        },
        params: [],
        rest: [],
        unknown: {},
      });
    });
  });
});
