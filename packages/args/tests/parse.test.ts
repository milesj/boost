import parse from '../src/parse';
import ParseError from '../src/ParseError';
import ValidationError from '../src/ValidationError';
import { SingleOption, Flag, MultipleOption } from '../src/types';

describe('parse()', () => {
  const optConfig: SingleOption<string> = {
    description: '',
    type: 'string',
  };

  const optConfigExpanded: SingleOption<string> = {
    default: 'foobar',
    description: '',
    short: 'O',
    type: 'string',
  };

  const optsConfig: MultipleOption<string[]> = {
    default: [],
    description: '',
    multiple: true,
    type: 'string',
  };

  const optsConfigExpanded: MultipleOption<string[]> = {
    default: ['qux'],
    description: '',
    multiple: true,
    short: 's',
    type: 'string',
  };

  const optsConfigArity: MultipleOption<string[]> = {
    arity: 2,
    default: [],
    description: '',
    multiple: true,
    short: 's',
    type: 'string',
  };

  const numConfig: SingleOption<number> = {
    description: '',
    type: 'number',
  };

  const numConfigExpanded: SingleOption<number> = {
    default: 123,
    description: '',
    short: 'n',
    type: 'number',
  };

  const numsConfig: MultipleOption<number[]> = {
    description: '',
    multiple: true,
    type: 'number',
  };

  const flagConfig: Flag = {
    default: false,
    description: '',
    short: 'F',
    type: 'boolean',
  };

  // For strings
  const SPECIAL_CHARS = [
    // empty string
    '',
    // space
    ' ',
    // dash (not to confuse with an option)
    '-',
    // underscore
    '_',
    // newline
    '\n',
    // tab
    '\t',
  ];

  // For numbers
  const SPECIAL_NUMBERS = [
    // zero
    '0',
    // float zero
    '0.0',
    // negative
    '-123',
    // float
    '12.45',
    // negative float
    '-12.45',
  ];

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
      positionals: [],
      rest: [],
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
      positionals: [],
      rest: [],
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
      positionals: [],
      rest: [],
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
      positionals: [],
      rest: ['--foo', '-B', 'baz'],
    });
  });

  it('captures bare arguments as positionals', () => {
    const result = parse(['foo', 'bar', 'baz'], { options: {} });

    expect(result).toEqual({
      command: [],
      errors: [],
      options: {},
      positionals: ['foo', 'bar', 'baz'],
      rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: ['bar'],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
            new ValidationError('Invalid value, must be one of foo, bar, baz, found qux.', 'opt'),
          ],
          options: {
            opt: 'qux',
          },
          positionals: [],
          rest: [],
        });
      });
    });

    describe('single - count', () => {
      it('errors when a non-number uses the `count` setting', () => {
        const result = parse<{ opt: string }>([], {
          options: {
            opt: {
              count: true,
              description: '',
              type: 'string',
            },
          },
        });

        expect(result).toEqual({
          command: [],
          errors: [new ValidationError('Only numeric options may use the `count` setting.', 'opt')],
          options: {
            opt: '',
          },
          positionals: [],
          rest: [],
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
              'Numeric options must have `count` enabled when passed in a short option group.',
              '-Fn',
              0,
            ),
          ],
          options: {
            flag: true,
            num: 123,
          },
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
        });
      });

      it('can interweave options and still increment', () => {
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
          positionals: [],
          rest: [],
        });
      });

      it('sets value to 1 if using the long form', () => {
        const result = parse<{ flag: boolean; num: number }>(['--num'], {
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
            num: 1,
          },
          positionals: [],
          rest: [],
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
          positionals: ['baz'],
          rest: [],
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
          positionals: ['arg'],
          rest: [],
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
          positionals: ['arg'],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
        });
      });

      it('runs custom validation using `validate`', () => {
        const result = parse<{ nums: number[] }>(['--nums', '1', '5', '10'], {
          options: {
            nums: {
              ...numsConfig,
              validate(value) {
                if (!value.every(val => val >= 5)) {
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
          positionals: [],
          rest: [],
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
          positionals: ['baz'],
          rest: [],
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
          positionals: ['baz'],
          rest: [],
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
          positionals: [],
          rest: [],
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
          errors: [new ValidationError('Not enough arity arguments. Require 2, found 1.', 'opts')],
          options: {
            opts: ['foo'],
          },
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          positionals: ['random', 'arg'],
          rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
      });
    });

    SPECIAL_CHARS.forEach(char => {
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
      });
    });

    SPECIAL_NUMBERS.forEach(char => {
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
          positionals: [],
          rest: [],
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
          positionals: [],
          rest: [],
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
          nums: SPECIAL_NUMBERS.map(no => Number(no)),
        },
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
            'Flags and short option groups may not use inline values.',
            '--flag=123',
            0,
          ),
        ],
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
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
        positionals: [],
        rest: [],
      });
    });
  });

  describe('commands', () => {
    it('sets as a positional if no commands defined', () => {
      const result = parse<{}>(['cmd', 'foo', 'bar'], {
        options: {},
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        positionals: ['cmd', 'foo', 'bar'],
        rest: [],
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
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });

      it('sets as a command if defined and using sub-commands', () => {
        const result = parse<{}>(['command:sub', 'foo', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['command', 'sub'],
          errors: [],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
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
              'Command has already been provided as "cmd", received another "cmd".',
              'cmd',
              2,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
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
              'Command has already been provided as "cmd", received another "command".',
              'command',
              2,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });

      it('errors if command is passed after positionals', () => {
        const result = parse<{}>(['foo', 'cmd', 'bar'], {
          commands: ['cmd', 'command'],
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command must be passed as the first non-option, non-positional argument.',
              'cmd',
              1,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
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
              'Invalid "comm_and" command format. Must be letters, numbers, and dashes.',
            ),
          ],
          options: {},
          positionals: [],
          rest: [],
        });
      });
    });

    describe('function', () => {
      it('sets as a command if valid', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands: arg => arg === 'cmd',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });

      it('doesnt set as a command if invalid', () => {
        const result = parse<{}>(['cmd', 'foo', 'bar'], {
          commands: arg => arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: [],
          errors: [],
          options: {},
          positionals: ['cmd', 'foo', 'bar'],
          rest: [],
        });
      });

      it('can validate sub-commands', () => {
        function commands(arg: string): boolean {
          const [main, sub] = arg.split(':');

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
          positionals: ['foo', 'bar'],
          rest: [],
        });

        const resultValidSub = parse<{}>(['cmd:one', 'foo', 'bar'], {
          commands,
          options: {},
        });

        expect(resultValidSub).toEqual({
          command: ['cmd', 'one'],
          errors: [],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });

        const resultInvalidSub = parse<{}>(['cmd:three', 'foo', 'bar'], {
          commands,
          options: {},
        });

        expect(resultInvalidSub).toEqual({
          command: [],
          errors: [],
          options: {},
          positionals: ['cmd:three', 'foo', 'bar'],
          rest: [],
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
          positionals: [],
          rest: [],
        });
      });

      it('errors if same command found multiple times', () => {
        const result = parse<{}>(['cmd', 'foo', 'cmd', 'bar'], {
          commands: arg => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "cmd".',
              'cmd',
              2,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });

      it('errors if multiple commands are passed', () => {
        const result = parse<{}>(['cmd', 'foo', 'command', 'bar'], {
          commands: arg => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command has already been provided as "cmd", received another "command".',
              'command',
              2,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });

      it('errors if command is passed after positionals', () => {
        const result = parse<{}>(['foo', 'cmd', 'bar'], {
          commands: arg => arg === 'cmd' || arg === 'command',
          options: {},
        });

        expect(result).toEqual({
          command: ['cmd'],
          errors: [
            new ParseError(
              'Command must be passed as the first non-option, non-positional argument.',
              'cmd',
              1,
            ),
          ],
          options: {},
          positionals: ['foo', 'bar'],
          rest: [],
        });
      });
    });
  });

  describe('positionals', () => {
    it('errors if a required positional comes after an optional', () => {
      const result = parse<{}, [string, string]>(['foo', 'bar'], {
        options: {},
        positionals: [
          { description: '', label: 'first', required: false, type: 'string' },
          { description: '', label: 'second', required: true, type: 'string' },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Optional positional(s) "first" found before required positional "second". Required must be first.',
          ),
        ],
        options: {},
        positionals: ['foo', 'bar'],
        rest: [],
      });
    });

    it('errors if a required positional is undefined', () => {
      const result = parse<{}, [string]>([], {
        options: {},
        positionals: [{ description: '', label: 'first', required: true, type: 'string' }],
      });

      expect(result).toEqual({
        command: [],
        errors: [new ValidationError('Positional "first" is required but value is undefined.')],
        options: {},
        positionals: [],
        rest: [],
      });
    });

    it('casts to value if a config exists, otherwise is a string', () => {
      const result = parse<{}, [number]>(['123', 'bar'], {
        options: {},
        positionals: [{ description: '', label: 'first', type: 'number' }],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        positionals: [123, 'bar'],
        rest: [],
      });
    });

    it('casts to boolean using keywords', () => {
      const result = parse<{}, [boolean, string, boolean]>(['off', 'bar', 'on'], {
        options: {},
        positionals: [
          { description: '', label: 'first', type: 'boolean' },
          { description: '', label: 'second', type: 'string' },
          { description: '', label: 'third', type: 'boolean' },
        ],
      });

      expect(result).toEqual({
        command: [],
        errors: [],
        options: {},
        positionals: [false, 'bar', true],
        rest: [],
      });
    });

    it('runs custom validation using `validate`', () => {
      const result = parse<{}, [string]>(['2019-01'], {
        options: {},
        positionals: [
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
        positionals: ['2019-01'],
        rest: [],
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
            // @ts-ignore
            default: 123,
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is set to boolean, but non-boolean default value found.',
          ),
        ],
        options: {
          foo: true,
        },
        positionals: [],
        rest: [],
      });
    });

    it('errors if string default value is not string', () => {
      const result = parse<{ foo: string }>([], {
        options: {
          foo: {
            description: '',
            type: 'string',
            // @ts-ignore
            default: 123,
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError('Option "foo" is set to string, but non-string default value found.'),
        ],
        options: {
          foo: '123',
        },
        positionals: [],
        rest: [],
      });
    });

    it('errors if number default value is not number', () => {
      const result = parse<{ foo: number }>([], {
        options: {
          foo: {
            description: '',
            type: 'number',
            // @ts-ignore
            default: 'abc',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError('Option "foo" is set to number, but non-number default value found.'),
        ],
        options: {
          foo: 0,
        },
        positionals: [],
        rest: [],
      });
    });

    it('errors if multiple default value is not an array', () => {
      const result = parse<{ foo: number[] }>([], {
        options: {
          foo: {
            description: '',
            multiple: true,
            type: 'number',
            // @ts-ignore
            default: 'abc',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [
          new ValidationError(
            'Option "foo" is enabled for multiple values, but non-array default value found.',
          ),
        ],
        options: {
          foo: [],
        },
        positionals: [],
        rest: [],
      });
    });

    it('errors if short name is not 1 character', () => {
      const result = parse<{ foo: string }>([], {
        options: {
          foo: {
            description: '',
            type: 'string',
            // @ts-ignore
            short: 'ab',
          },
        },
      });

      expect(result).toEqual({
        command: [],
        errors: [new ValidationError('Short option "ab" may only be a single letter.')],
        options: {
          foo: '',
        },
        positionals: [],
        rest: [],
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
        errors: [new ValidationError('Short option "a" has already been defined for "foo".')],
        options: {
          bar: '',
          foo: '',
        },
        positionals: [],
        rest: [],
      });
    });
  });
});
