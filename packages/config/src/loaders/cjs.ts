import { Path } from '@boost/common';
import { loadJs } from './js';

export async function loadCjs<T>(path: Path): Promise<T> {
	return loadJs<T>(path);
}
