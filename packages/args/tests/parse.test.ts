import parse from '../src/parse';

describe('parse()', () => {
  it('supports camel case option names by default', () => {
    const result = parse<{ fooBar: string }>(['node', 'cmd', '--fooBar', 'baz'], {
      fooBar: {
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {},
      args: {
        fooBar: 'baz',
      },
      argv: ['node', 'cmd', '--fooBar', 'baz'],
      command: 'cmd',
      positionals: [],
      rest: [],
    });
  });

  it('converts dashed option names to camel case', () => {
    const result = parse<{ fooBar: string }>(['node', 'cmd', '--foo-bar', 'baz'], {
      fooBar: {
        description: '',
        type: 'string',
      },
    });

    expect(result).toEqual({
      aliases: {},
      args: {
        fooBar: 'baz',
      },
      argv: ['node', 'cmd', '--foo-bar', 'baz'],
      command: 'cmd',
      positionals: [],
      rest: [],
    });
  });

  it('captures all rest arguments after `--`', () => {
    const result = parse<{ flag: boolean }>(['node', 'cmd', '--flag', '--', '--foo', '-B', 'baz'], {
      flag: {
        description: '',
        type: 'boolean',
      },
    });

    expect(result).toEqual({
      aliases: {},
      args: {
        flag: true,
      },
      argv: ['node', 'cmd', '--flag', '--', '--foo', '-B', 'baz'],
      command: 'cmd',
      positionals: [],
      rest: ['--foo', '-B', 'baz'],
    });
  });

  describe('string options', () => {
    it('inherits default value', () => {
      const result = parse<{ opt: string }>(['node', 'cmd'], {
        opt: {
          default: 'foo',
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          opt: 'foo',
        },
        argv: ['node', 'cmd'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('sets to empty string when `default` not defined', () => {
      const result = parse<{ opt: string }>(['node', 'cmd'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          opt: '',
        },
        argv: ['node', 'cmd'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed', () => {
      const result = parse<{ opt: string }>(['node', 'cmd', '--opt', 'foo'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          opt: 'foo',
        },
        argv: ['node', 'cmd', '--opt', 'foo'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('sets value when option is passed and is using inline value', () => {
      const result = parse<{ opt: string }>(['node', 'cmd', '--opt=foo'], {
        opt: {
          description: '',
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          opt: 'foo',
        },
        argv: ['node', 'cmd', '--opt=foo'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('expands alias and sets value', () => {
      const result = parse<{ opt: string }>(['node', 'cmd', '-O', 'foo'], {
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
        args: {
          opt: 'foo',
        },
        argv: ['node', 'cmd', '-O', 'foo'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('expands alias and sets inline value', () => {
      const result = parse<{ opt: string }>(['node', 'cmd', '-O=foo'], {
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
        args: {
          opt: 'foo',
        },
        argv: ['node', 'cmd', '-O=foo'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('captures multiple values', () => {
      const result = parse<{ opt: string[] }>(['node', 'cmd', '--opt', 'foo', 'bar', 'baz'], {
        opt: {
          default: ['qux'],
          description: '',
          multiple: true,
          type: 'string',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          opt: ['qux', 'foo', 'bar', 'baz'],
        },
        argv: ['node', 'cmd', '--opt', 'foo', 'bar', 'baz'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('captures multiple values until next option is found', () => {
      const result = parse<{ flag: boolean; opt: string[] }>(
        ['node', 'cmd', '--opt', 'foo', 'bar', '--flag', 'baz'],
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
        args: {
          flag: true,
          opt: ['foo', 'bar'],
        },
        argv: ['node', 'cmd', '--opt', 'foo', 'bar', '--flag', 'baz'],
        command: 'cmd',
        positionals: ['baz'],
        rest: [],
      });
    });
  });

  describe('flags', () => {
    it('inherits default value', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd'], {
        flag: {
          default: true,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          flag: true,
        },
        argv: ['node', 'cmd'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('sets to `false` when `default` not defined', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd'], {
        flag: {
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          flag: false,
        },
        argv: ['node', 'cmd'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('sets to `true` when option passed', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd', '--flag'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          flag: true,
        },
        argv: ['node', 'cmd', '--flag'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('ignores inline value', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd', '--flag=123'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          flag: true,
        },
        argv: ['node', 'cmd', '--flag=123'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('negates value when option starts with `no-`', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd', '--flag', '--no-flag'], {
        flag: {
          default: false,
          description: '',
          type: 'boolean',
        },
      });

      expect(result).toEqual({
        aliases: {},
        args: {
          flag: false,
        },
        argv: ['node', 'cmd', '--flag', '--no-flag'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });

    it('expands alias', () => {
      const result = parse<{ flag: boolean }>(['node', 'cmd', '-F'], {
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
        args: {
          flag: true,
        },
        argv: ['node', 'cmd', '-F'],
        command: 'cmd',
        positionals: [],
        rest: [],
      });
    });
  });
});
