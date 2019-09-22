import parse from '../src/parse';

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

    it('expands alias and sets value', () => {
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

    it('expands alias and sets inline value', () => {
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
  });
});
