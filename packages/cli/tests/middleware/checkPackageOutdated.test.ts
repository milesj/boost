import https from 'https';
import { Loggable } from '@boost/log';
import { mockLogger } from '@boost/log/test';
import { checkPackageOutdated } from '../../src/middleware/checkPackageOutdated';

describe('checkPackageOutdated()', () => {
	let httpsSpy: jest.SpyInstance;
	let logSpy: Loggable;

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

		logSpy = mockLogger();
	});

	afterEach(() => {
		httpsSpy.mockRestore();
	});

	it('doesnt log when version is latest', async () => {
		const mw = checkPackageOutdated('pkg', '1.2.3');

		await mw([], parse, logSpy);

		expect(logSpy.info).not.toHaveBeenCalled();
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

		const mw = checkPackageOutdated('pkg', '1.2.3');

		await mw([], parse, logSpy);

		expect(logSpy.info).not.toHaveBeenCalled();
	});

	it('logs when version is out of date', async () => {
		const mw = checkPackageOutdated('pkg', '1.0.0');

		await mw([], parse, logSpy);

		expect(logSpy.info).toHaveBeenCalledWith(
			'Your version of pkg is out of date.',
			"Latest version is 1.2.3, while you're using 1.0.0.",
		);
	});
});
