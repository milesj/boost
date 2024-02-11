/* eslint-disable @typescript-eslint/no-use-before-define */

import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { afterAll } from 'vitest';
import type { DirectoryStructure } from './types';

const FIXTURES_DIR = path.join(process.cwd(), '../../tests/__fixtures__');

const TEMPORARY_FILES = new Set<string>();

function normalizeSeparators(part: string) {
	if (process.platform === 'win32') {
		return part.replace(/\//g, '\\');
	}

	return part.replace(/\\/g, '/');
}

export function normalizePath(...parts: string[]): string {
	return path.normalize(path.join(...parts.map(normalizeSeparators)));
}

export function getFixturePath(fixture: string, file: string = ''): string {
	return normalizePath(FIXTURES_DIR, fixture, file);
}

export function getFixtureNodeModulePath(
	fixture: string,
	moduleName: string,
	file: string = '',
): string {
	return normalizePath(FIXTURES_DIR, fixture, 'node_modules', moduleName, file);
}

export function getNodeModulePath(moduleName: string, file: string = ''): string {
	return normalizePath(process.cwd(), 'node_modules', moduleName, file);
}

export function removeTempFile(filePath: string) {
	if (fs.existsSync(filePath)) {
		try {
			if (fs.statSync(filePath).isDirectory()) {
				fs.emptyDirSync(filePath);
			}

			fs.removeSync(filePath);
		} catch {
			// Ignore?
		}
	}

	TEMPORARY_FILES.delete(filePath);
}

export function copyFixtureToNodeModule(
	fixture: string,
	moduleName: string,
	customModulePath: boolean = false,
): () => void {
	const modulePath = customModulePath ? normalizePath(moduleName) : getNodeModulePath(moduleName);
	const pkgPath = normalizePath(path.join(modulePath, 'package.json'));

	fs.copySync(getFixturePath(fixture), modulePath, { overwrite: true });

	if (!fs.existsSync(pkgPath)) {
		fs.writeJsonSync(pkgPath, {
			main: './index.js',
			name: moduleName,
			version: '0.0.0',
		});
	}

	return () => {
		removeTempFile(modulePath);
	};
}

export function copyFixtureToTempFolder(fixture: string): string {
	const tempRoot = createTempFixtureFolder();

	fs.copySync(getFixturePath(fixture), tempRoot, { overwrite: true });

	return tempRoot;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTempFileInFixture(fixture: string, file: string, data: any): () => void {
	const filePath = getFixturePath(fixture, file);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	fs.writeFileSync(filePath, data);

	return () => {
		removeTempFile(filePath);
	};
}

let folderCount = 0;

export function createTempFixtureFolder(): string {
	const tmp = os.tmpdir();
	// eslint-disable-next-line no-magic-numbers
	const dir = normalizePath(tmp, `boost-${Date.now().toString(16)}${folderCount}`);

	fs.ensureDirSync(dir);
	folderCount += 1;

	TEMPORARY_FILES.add(dir);

	return dir;
}

export function createTempFolderStructureFromJSON(structure: DirectoryStructure): string {
	const root = createTempFixtureFolder();
	const files = typeof structure === 'function' ? structure(root) : structure;

	Object.entries(files).forEach(([file, contents]) => {
		if (contents === null) {
			return;
		}

		const absFile = path.join(root, file);

		fs.ensureDirSync(path.dirname(absFile));
		fs.writeFileSync(absFile, contents, 'utf8');
	});

	return root;
}

afterAll(() => {
	[...TEMPORARY_FILES].forEach((tempFile) => {
		removeTempFile(tempFile);
	});
});
