import https from 'https';
import checkPackageOutdated from '../../src/middleware/checkPackageOutdated';

describe('checkPackageOutdated()', () => {
  let httpsSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;

  const parse = () =>
    Promise.resolve({
      command: [],
      errors: [],
      options: { help: false, locale: '', version: false },
      params: [],
      rest: [],
      unknown: {},
    });

  beforeEach(() => {
    httpsSpy = jest.spyOn(https, 'get').mockImplementation((url, res) => {
      (res as Function)({
        on(type: string, cb: (data?: string) => void) {
          if (type === 'data') {
            cb(JSON.stringify({ 'dist-tags': { latest: '1.2.3' } }));
          } else {
            cb();
          }
        },
      });

      return {} as any;
    });

    infoSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    httpsSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it('doesnt log when version is latest', async () => {
    const mw = checkPackageOutdated('packemon', '1.2.3');

    await mw([], parse);

    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('doesnt log when version request fails', async () => {
    httpsSpy.mockImplementation((url, res) => {
      (res as Function)({
        on(type: string, cb: Function) {
          if (type === 'error') {
            cb();
          }
        },
      });

      return {} as any;
    });

    const mw = checkPackageOutdated('packemon', '1.2.3');

    await mw([], parse);

    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('logs when version is out of date', async () => {
    const mw = checkPackageOutdated('packemon', '1.0.0');

    await mw([], parse);

    expect(infoSpy).toHaveBeenCalledWith(
      'Your version of packemon is out of date.',
      "Latest version is 1.2.3, while you're using 1.0.0.",
    );
  });
});
