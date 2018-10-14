import path from 'path';
import FileBackend from '../../src/i18n/FileBackend';

describe('FileBackend', () => {
  let backend: FileBackend;

  beforeEach(() => {
    backend = new FileBackend();
    backend.init(
      {
        interpolator: {
          interpolate(string: string, params: any): string {
            let message = string;

            Object.keys(params).forEach(key => {
              message = message.replace(`{{${key}}}`, params[key]);
            });

            return message;
          },
        },
      },
      {
        resourcePaths: [path.join(__dirname, '../../resources')],
      },
    );
  });

  describe('read()', () => {
    it('returns empty object for missing locale', () => {
      expect(backend.read('fr', 'app', () => {})).toEqual({});
    });

    it('returns object for defined locales', () => {
      expect(backend.read('en', 'app', () => {})).toEqual(
        expect.objectContaining({
          ciRanIn: 'Ran {{routineCount}} routine(s) and {{taskCount}} task(s) in {{time}}',
        }),
      );
    });

    it('caches files after lookup', () => {
      expect(backend.fileCache).toEqual({});

      backend.read('en', 'app', () => {});

      const key = path.join(__dirname, '../../resources/en/app.json');
      const cache = backend.fileCache[key];

      expect(backend.fileCache[key]).toBeDefined();

      backend.read('en', 'app', () => {});

      expect(backend.fileCache[key]).toBe(cache);
    });
  });
});
