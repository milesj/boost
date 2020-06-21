import { Path, PackageStructure } from '@boost/common';
import loadMjs from './mjs';
import loadCjs from './cjs';

export default function loadJs<T>(path: Path, pkg: PackageStructure): Promise<T> {
  return pkg.type === 'module' ? loadMjs(path) : loadCjs(path);
}
