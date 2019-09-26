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

  const optsConfig: MultipleOption<string> = {
    default: [],
    description: '',
    multiple: true,
    type: 'string',
  };

  const optsConfigExpanded: MultipleOption<string> = {
    default: ['qux'],
    description: '',
    multiple: true,
    short: 's',
    type: 'string',
  };

  const optsConfigArity: MultipleOption<string> = {
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

  const numsConfig: MultipleOption<number> = {
    description: '',
    multiple: true,
    type: 'number',
  };

  const flagConfig: Flag = {
    default: false,
    description: '',
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
      fooBar: {
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
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
      fooBar: {
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
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
        foo123: optConfig,
        bar456: optConfig,
      },
    );

    expect(result).toEqual({
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
      flag: {
        description: '',
        type: 'boolean',
      },
    });

    expect(result).toEqual({
      errors: [],
      options: {
        flag: true,
      },
      positionals: [],
      rest: ['--foo', '-B', 'baz'],
    });
  });

  it('captures bare arguments as positionals', () => {
    const result = parse(['foo', 'bar', 'baz'], {});

    expect(result).toEqual({
      errors: [],
      options: {},
      positionals: ['foo', 'bar', 'baz'],
      rest: [],
    });
  });

  describe('errors', () => {
    it.skip('errors when an invalid choice value is used', () => {
      expect(() => {
        parse<{ opt: string }>(['--opt', 'qux'], {
          opt: {
            choices: ['foo', 'bar', 'baz'],
            description: '',
            type: 'string',
          },
        });
      }).toThrowError('Invalid --opt value, must be one of foo, bar, baz, found qux.');
    });
  });

  describe('options', () => {
    describe('single', () => {
      it('sets value from next subsequent arg', () => {
        const result = parse<{ opt: string }>(['--opt', 'foo'], {
          opt: optConfig,
        });

        expect(result).toEqual({
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
          opt: optConfig,
        });

        expect(result).toEqual({
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
          opt: optConfig,
        });

        expect(result).toEqual({
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
          opt: optConfigExpanded,
        });

        expect(result).toEqual({
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
          opt: optConfigExpanded,
        });

        expect(result).toEqual({
          errors: [],
          options: {
            opt: 'baz',
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
            flag: flagConfig,
            opts: optsConfig,
          },
        );

        expect(result).toEqual({
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
            opts: optsConfigExpanded,
          },
        );

        expect(result).toEqual({
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
            opts: optsConfigExpanded,
          },
        );

        expect(result).toEqual({
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
            flag: flagConfig,
            opts: optsConfigExpanded,
          },
        );

        expect(result).toEqual({
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
            flag: flagConfig,
            opts: optsConfigExpanded,
          },
        );

        expect(result).toEqual({
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
          opts: {
            description: '',
            multiple: true,
            type: 'string',
          },
        });

        expect(result).toEqual({
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
          opts: optsConfigExpanded,
        });

        expect(result).toEqual({
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
          opts: optsConfigExpanded,
        });

        expect(result).toEqual({
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
          opts: optsConfigExpanded,
        });

        expect(result).toEqual({
          errors: [],
          options: {
            opts: ['foo', 'foo', 'foo'],
          },
          positionals: [],
          rest: [],
        });
      });
    });

    describe('multiple arity', () => {
      it('captures values up until the arity count', () => {
        const result = parse<{ opts: string[] }>(['--opts', 'foo', 'bar', 'baz'], {
          opts: optsConfigArity,
        });

        expect(result).toEqual({
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
          opts: optsConfigArity,
        });

        expect(result).toEqual({
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
            ars: { ...optsConfigArity, default: [], short: 'a', type: 'number' },
            opts: optsConfigArity,
          },
        );

        expect(result).toEqual({
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
          opts: optsConfigArity,
        });

        expect(result).toEqual({
          errors: [new ValidationError('Not enough arity arguments. Require 2, found 1.')],
          options: {
            opts: ['foo'],
          },
          positionals: [],
          rest: [],
        });
      });

      it('doesnt error if no values but arity is enabled', () => {
        const result = parse<{ opts: string[] }>([], {
          opts: optsConfigArity,
        });

        expect(result).toEqual({
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
          opt: optConfigExpanded,
        });

        expect(result).toEqual({
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
          opt: optConfigExpanded,
        });

        expect(result).toEqual({
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
        );

        expect(result).toEqual({
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

      it('expands flag group and sets all to truthy', () => {
        const baseConfig: Flag = {
          default: false,
          description: '',
          type: 'boolean',
        };

        const result = parse<{ foo: boolean; bar: boolean; baz: boolean; qux: boolean }>(
          ['random', '-ZqF', 'arg'],
          {
            bar: { ...baseConfig, short: 'b' },
            baz: { ...baseConfig, short: 'Z' },
            foo: { ...baseConfig, short: 'F' },
            qux: { ...baseConfig, short: 'q' },
          },
        );

        expect(result).toEqual({
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
        opt: optConfigExpanded,
      });

      expect(result).toEqual({
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
        opt: optConfig,
      });

      expect(result).toEqual({
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
        opt: optConfig,
      });

      expect(result).toEqual({
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
        opt: optConfig,
      });

      expect(result).toEqual({
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
        opt: optConfig,
      });

      expect(result).toEqual({
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
          opt: optConfig,
        });

        expect(result).toEqual({
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
          opt: optConfig,
        });

        expect(result).toEqual({
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
        opts: optsConfig,
      });

      expect(result).toEqual({
        errors: [],
        options: {
          opts: SPECIAL_CHARS,
        },
        positionals: [],
        rest: [],
      });
    });

    it.skip('sets value based on a list of choices', () => {
      const result = parse<{ opt: string }>(['--opt', 'baz'], {
        opt: {
          choices: ['foo', 'bar', 'baz'],
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        errors: [],
        options: {
          opt: 'baz',
        },
        positionals: [],
        rest: [],
      });
    });

    it.skip('captures multiple values', () => {
      const result = parse<{ opt: string[] }>(['--opt', 'foo', 'bar', 'baz'], {
        opt: {
          default: ['qux'],
          description: '',
          multiple: true,
          type: 'string',
        },
      });

      expect(result).toEqual({
        errors: [],
        options: {
          opt: ['qux', 'foo', 'bar', 'baz'],
        },
        positionals: [],
        rest: [],
      });
    });
  });

  describe('number options', () => {
    it('inherits default value when nothing passed', () => {
      const result = parse<{ num: number }>([], {
        num: numConfigExpanded,
      });

      expect(result).toEqual({
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
        num: numConfig,
      });

      expect(result).toEqual({
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
        num: numConfig,
      });

      expect(result).toEqual({
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
        num: numConfig,
      });

      expect(result).toEqual({
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
        num: numConfig,
      });

      expect(result).toEqual({
        errors: [],
        options: {
          num: 123,
        },
        positionals: [],
        rest: [],
      });
    });

    it.skip('sets value based on a list of choices', () => {
      const result = parse<{ opt: number }>(['--opt', '2'], {
        opt: {
          choices: [1, 2, 3],
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        errors: [],
        options: {
          opt: 2,
        },
        positionals: [],
        rest: [],
      });
    });

    it.skip('captures multiple values', () => {
      const result = parse<{ opt: number[] }>(['--opt', '1', '2', '3'], {
        opt: {
          default: [0],
          description: '',
          multiple: true,
          type: 'number',
        },
      });

      expect(result).toEqual({
        errors: [],
        options: {
          opt: [0, 1, 2, 3],
        },
        positionals: [],
        rest: [],
      });
    });

    SPECIAL_NUMBERS.forEach(char => {
      it(`supports "${char}"`, () => {
        const result = parse<{ num: number }>(['--num', char], {
          num: numConfig,
        });

        expect(result).toEqual({
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
          num: numConfig,
        });

        expect(result).toEqual({
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
        nums: numsConfig,
      });

      expect(result).toEqual({
        errors: [],
        options: {
          nums: SPECIAL_NUMBERS.map(no => Number(no)),
        },
        positionals: [],
        rest: [],
      });
    });
  });

  describe('flags', () => {
    it('inherits default value when nothing passed', () => {
      const result = parse<{ flag: boolean }>([], {
        flag: {
          default: true,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
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
        flag: {
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
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
        flag: flagConfig,
      });

      expect(result).toEqual({
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
        flag: flagConfig,
      });

      expect(result).toEqual({
        errors: [new ParseError('Flags and flag groups may not use inline values.', '--flag=123')],
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
      });
    });

    it('negates value when option starts with `no-`', () => {
      const result = parse<{ flag: boolean }>(['--flag', '--no-flag'], {
        flag: flagConfig,
      });

      expect(result).toEqual({
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
        flag: {
          ...flagConfig,
          short: 'F',
        },
      });

      expect(result).toEqual({
        errors: [],
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
      });
    });
  });
});
