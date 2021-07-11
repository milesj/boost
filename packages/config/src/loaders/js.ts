import { PackageStructure, Path } from '@boost/common';
import { loadCjs } from './cjs';
import { loadMjs } from './mjs';

export async function loadJs<T>(path: Path, pkg: PackageStructure): Promise<T> {
	return pkg.type === 'module' ? loadMjs(path) : loadCjs(path);
}
