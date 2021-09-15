import { BackendModule, Resource, ResourceKey } from 'i18next';
import { Blueprint, Contract, json, Path, Predicates, yaml } from '@boost/common';
import { internalRequire } from '@boost/internal';
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

	type: 'backend' = 'backend';

	init(services: unknown, options: Partial<FileBackendOptions>) {
		this.configure(options);

		// Validate resource paths are directories
		this.options.paths.forEach((path) => {
			if (path.exists() && !path.isDirectory()) {
				throw new TranslateError('RESOURCE_PATH_INVALID', [path.path()]);
			}
		});
	}

	blueprint(predicates: Predicates): Blueprint<FileBackendOptions> {
		const { array, instance, string } = predicates;

		return {
			format: string('yaml').oneOf<Format>(['js', 'json', 'yaml']),
			paths: array(instance(Path, true).notNullable()),
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
	): ResourceKey {
		const { format, paths } = this.options;
		const resources: ResourceKey = {};

		paths.forEach((path) => {
			EXTS[format].some((ext) => {
				const resPath = path.append(locale, `${namespace}.${ext}`);
				const isCached = this.fileCache.has(resPath);

				if (!resPath.exists()) {
					return false;
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
							content = internalRequire(resPath.path()) as ResourceKey;
							break;
					}

					this.fileCache.set(resPath, content);
				}

				Object.assign(resources, this.fileCache.get(resPath));

				return true;
			});
		});

		handler(null, resources);

		return resources;
	}
}
