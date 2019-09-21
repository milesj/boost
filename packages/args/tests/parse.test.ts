import parse from '../src/parse';

describe('parse()', () => {
  describe('options', () => {});

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
