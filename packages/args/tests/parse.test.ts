import parse from '../src/parse';

console.log(process.argv);

describe('parse()', () => {
  it('supports camel case option names by default', () => {
    const result = parse<{ fooBar: string }>(['--fooBar', 'baz'], {
      fooBar: {
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {},
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
      aliases: {},
      options: {
        fooBar: 'baz',
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
      aliases: {},
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
      aliases: {},
      options: {},
      positionals: ['foo', 'bar', 'baz'],
      rest: [],
    });
  });

  it('captures multiple values until next option is found', () => {
    const result = parse<{ flag: boolean; opt: string[] }>(
      ['--opt', 'foo', 'bar', '--flag', 'baz'],
      {
        flag: {
          description: '',
          type: 'boolean',
        },
        opt: {
          default: [],
          description: '',
          multiple: true,
          type: 'string',
        },
      },
    );

    expect(result).toEqual({
      aliases: {},
      options: {
        flag: true,
        opt: ['foo', 'bar'],
      },
      positionals: ['baz'],
      rest: [],
    });
  });

  it('captures multiple values from separate options of the same name', () => {
    const result = parse<{ opt: string[] }>(['--opt', 'foo', '--opt', 'bar', '--opt', 'baz'], {
      opt: {
        default: ['qux'],
        description: '',
        multiple: true,
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {},
      options: {
        opt: ['qux', 'foo', 'bar', 'baz'],
      },
      positionals: [],
      rest: [],
    });
  });

  it('expands alias name in the result and sets value', () => {
    const result = parse<{ opt: string }>(['-O', 'foo'], {
      opt: {
        alias: 'O',
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {
        O: 'opt',
      },
      options: {
        opt: 'foo',
      },
      positionals: [],
      rest: [],
    });
  });

  it('expands alias name in the result and sets inline value', () => {
    const result = parse<{ opt: string }>(['-O=foo'], {
      opt: {
        alias: 'O',
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {
        O: 'opt',
      },
      options: {
        opt: 'foo',
      },
      positionals: [],
      rest: [],
    });
  });

  it('subsequent options of the same name override previous value', () => {
    const result = parse<{ opt: string }>(['--opt', 'foo', '--opt', 'bar', '--opt', 'baz'], {
      opt: {
        default: 'qux',
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {},
      options: {
        opt: 'baz',
      },
      positionals: [],
      rest: [],
    });
  });

  describe('errors', () => {
    it('errors when an invalid choice value is used', () => {
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

  describe('string options', () => {
    it('inherits default value', () => {
      const result = parse<{ opt: string }>([], {
        opt: {
          default: 'foo',
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 'foo',
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets to empty string when `default` not defined', () => {
      const result = parse<{ opt: string }>([], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: '',
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed', () => {
      const result = parse<{ opt: string }>(['--opt', 'foo'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 'foo',
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed and is using inline value', () => {
      const result = parse<{ opt: string }>(['--opt=foo'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 'foo',
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value based on a list of choices', () => {
      const result = parse<{ opt: string }>(['--opt', 'baz'], {
        opt: {
          choices: ['foo', 'bar', 'baz'],
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 'baz',
        },
        positionals: [],
        rest: [],
      });
    });

    it('captures multiple values', () => {
      const result = parse<{ opt: string[] }>(['--opt', 'foo', 'bar', 'baz'], {
        opt: {
          default: ['qux'],
          description: '',
          multiple: true,
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: ['qux', 'foo', 'bar', 'baz'],
        },
        positionals: [],
        rest: [],
      });
    });

    it('supports newlines in string', () => {
      const result = parse<{ opt: string }>(['--opt', 'foo\nbar'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 'foo\nbar',
        },
        positionals: [],
        rest: [],
      });
    });
  });

  describe('number options', () => {
    it('inherits default value', () => {
      const result = parse<{ opt: number }>([], {
        opt: {
          default: 123,
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 123,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets to zero when `default` not defined', () => {
      const result = parse<{ opt: number }>([], {
        opt: {
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 0,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets to zero when option passed is an invalid number', () => {
      const result = parse<{ opt: number }>(['--opt', 'foo'], {
        opt: {
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 0,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed', () => {
      const result = parse<{ opt: number }>(['--opt', '123'], {
        opt: {
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 123,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed and is using inline value', () => {
      const result = parse<{ opt: number }>(['--opt=123'], {
        opt: {
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 123,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets value based on a list of choices', () => {
      const result = parse<{ opt: number }>(['--opt', '2'], {
        opt: {
          choices: [1, 2, 3],
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 2,
        },
        positionals: [],
        rest: [],
      });
    });

    it('captures multiple values', () => {
      const result = parse<{ opt: number[] }>(['--opt', '1', '2', '3'], {
        opt: {
          default: [0],
          description: '',
          multiple: true,
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: [0, 1, 2, 3],
        },
        positionals: [],
        rest: [],
      });
    });

    it('supports floats/decimals', () => {
      const result = parse<{ opt: number }>(['--opt', '12.3'], {
        opt: {
          description: '',
          type: 'number',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          opt: 12.3,
        },
        positionals: [],
        rest: [],
      });
    });
  });

  describe('flags', () => {
    it('inherits default value', () => {
      const result = parse<{ flag: boolean }>([], {
        flag: {
          default: true,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
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
        aliases: {},
        options: {
          flag: false,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets to `true` when option passed', () => {
      const result = parse<{ flag: boolean }>(['--flag'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
      });
    });

    it('ignores inline value', () => {
      const result = parse<{ flag: boolean }>(['--flag=123'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
      });
    });

    it('negates value when option starts with `no-`', () => {
      const result = parse<{ flag: boolean }>(['--flag', '--no-flag'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        options: {
          flag: false,
        },
        positionals: [],
        rest: [],
      });
    });

    it('expands alias', () => {
      const result = parse<{ flag: boolean }>(['-F'], {
        flag: {
          alias: 'F',
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {
          F: 'flag',
        },
        options: {
          flag: true,
        },
        positionals: [],
        rest: [],
      });
    });

    it('sets all to `true` in alias flag group', () => {
      const result = parse<{ foo: boolean; bar: boolean; baz: boolean }>(['-bBf'], {
        foo: {
          alias: 'f',
          default: false,
          description: '',
          type: 'boolean',
        },
        bar: {
          alias: 'b',
          default: false,
          description: '',
          type: 'boolean',
        },
        baz: {
          alias: 'B',
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {
          B: 'baz',
          b: 'bar',
          f: 'foo',
        },
        options: {
          foo: true,
          bar: true,
          baz: true,
        },
        positionals: [],
        rest: [],
      });
    });
  });
});
