import https from 'https';
import semver from 'semver';
import { json } from '@boost/common';
import { Middleware } from '../types';

function fetchPackageLatestVersion(name: string): Promise<string | undefined> {
	return new Promise((resolve) => {
		https.get(`https://registry.npmjs.org/${name}`, (resp) => {
			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				const pkg = json.parse<{ 'dist-tags': Record<string, string> }>(data);

				resolve(pkg['dist-tags']?.latest);
			});

			resp.on('error', () => {
				// Instead of failing the process, return a fake response
				resolve(undefined);
			});
		});
	});
}

export default function checkPackageOutdated(name: string, version: string): Middleware {
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
