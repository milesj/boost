import https from 'https';
import semver from 'semver';
import { json } from '@boost/common';
import { Middleware } from '../types';

async function fetchPackageLatestVersion(name: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		const exit = () => {
			// Instead of failing the process, return a fake response
			resolve(undefined);
		};

		https
			.get(`https://registry.npmjs.org/${name}`, (resp) => {
				let data = '';

				resp.on('data', (chunk) => {
					data += String(chunk);
				});

				resp.on('end', () => {
					const pkg = json.parse<{ 'dist-tags': Record<string, string> }>(data);

					resolve(pkg['dist-tags']?.latest);
				});

				resp.on('error', exit);
			})
			.on('error', exit);
	});
}

/**
 * Verify that a package and its provided version is using the latest distribution
 * version by checking against the npm registry. If not, a console message will be logged.
 */
export function checkPackageOutdated(name: string, version: string): Middleware {
	return async (argv, parse, logger) => {
		const latestVersion = await fetchPackageLatestVersion(name);

		if (latestVersion && !semver.satisfies(version, `>=${latestVersion}`)) {
			logger.info(
				`Your version of ${name} is out of date.`,
				`Latest version is ${latestVersion}, while you're using ${version}.`,
			);
		}

		return parse(argv);
	};
}
