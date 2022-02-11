import fs from 'fs';
import { Path } from '@boost/common';
import { Blueprint, Schemas } from '@boost/common/optimal';
import { color } from '@boost/internal';
import { Finder } from './Finder';
import { IgnoreFile, IgnoreFinderOptions } from './types';

export class IgnoreFinder extends Finder<IgnoreFile, IgnoreFinderOptions> {
	blueprint(schemas: Schemas): Blueprint<IgnoreFinderOptions> {
		const { bool, string } = schemas;

		return {
			errorIfNoRootFound: bool(true),
			name: string().required().camelCase(),
		};
	}

	/**
	 * Find a single ignore file in the provided directory.
	 */
	// eslint-disable-next-line @typescript-eslint/require-await
	async findFilesInDir(dir: Path): Promise<Path[]> {
		const files: Path[] = [];
		const path = dir.append(this.getFileName());

		if (path.exists()) {
			files.push(path);
		}

		this.debug.invariant(
			files.length > 0,
			`Finding ignore files in ${color.filePath(dir.path())}`,
			files.map((file) => file.name()).join(', '),
			'No files',
		);

		return files;
	}

	/**
	 * Return an ignore specific file.
	 */
	getFileName(): string {
		return `.${this.options.name.toLowerCase()}ignore`;
	}

	/**
	 * Load and parse a list of found files into a list of ignore patterns.
	 */
	async resolveFiles(basePath: Path, foundFiles: Path[]): Promise<IgnoreFile[]> {
		this.debug('Resolving %d ignore files', foundFiles.length);

		return Promise.all(
			foundFiles.map(async (filePath) => {
				const contents = await this.cache.cacheFileContents(filePath, () =>
					fs.promises.readFile(filePath.path(), 'utf8'),
				);
				const ignore = contents
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line !== '' && !line.startsWith('#'));

				return {
					ignore,
					path: filePath,
					source: this.isRootDir(filePath.parent()) ? ('root' as const) : ('branch' as const),
				};
			}),
		);
	}
}
