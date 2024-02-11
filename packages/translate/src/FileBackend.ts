/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable promise/prefer-await-to-then */

import { BackendModule, Resource, ResourceKey, ResourceKeys } from 'i18next';
import { Contract, json, Path, yaml } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { importAbsoluteModule } from '@boost/internal';
import { TranslateError } from './TranslateError';
import { Format, Locale } from './types';

const EXTS: { [K in Format]: string[] } = {
	js: ['js'],
	json: ['json', 'json5'],
	yaml: ['yaml', 'yml'],
};

export interface FileBackendOptions {
	format?: Format;
	paths?: Path[];
}

export class FileBackend extends Contract<FileBackendOptions> implements BackendModule {
	fileCache = new Map<Path, ResourceKey>();

	type = 'backend' as const;

	resources: ResourceKeys = {};

	init(services: unknown, options: Partial<FileBackendOptions>) {
		this.configure(options);

		// Validate resource paths are directories
		this.options.paths.forEach((path) => {
			if (path.exists() && !path.isDirectory()) {
				throw new TranslateError('RESOURCE_PATH_INVALID', [path.path()]);
			}
		});
	}

	blueprint(schemas: Schemas): Blueprint<FileBackendOptions> {
		const { array, instance, string } = schemas;

		return {
			format: string('yaml').oneOf<Format>(['js', 'json', 'yaml']),
			paths: array().of(instance().of(Path, { loose: true }).notNullable()),
		};
	}

	// istanbul ignore next
	create() {
		// We don't need this but is required by the interface
	}

	read(
		locale: Locale,
		namespace: string,
		handler: (error: Error | null, resources: Resource) => void,
	): void {
		const { format, paths } = this.options;
		const resources: ResourceKey = {};

		Promise.all(
			paths.map(async (path) => {
				await Promise.all(
					EXTS[format].map(async (ext) => {
						const resPath = path.append(locale, `${namespace}.${ext}`);
						const isCached = this.fileCache.has(resPath);

						if (!resPath.exists()) {
							return;
						}

						if (!isCached) {
							let content: ResourceKey;

							switch (ext) {
								case 'yml':
								case 'yaml':
									content = yaml.load(resPath);
									break;
								case 'json':
								case 'json5':
									content = json.load(resPath);
									break;
								default:
									content = await importAbsoluteModule<ResourceKey>(resPath.path());
									break;
							}

							this.fileCache.set(resPath, content);
						}

						Object.assign(resources, this.fileCache.get(resPath));
					}),
				);
			}),
		)
			.then(() => {
				this.resources = resources;
				handler(null, resources);
			})
			.catch((error) => {
				handler(error as Error, {});
			});
	}
}
