import { Path } from '@boost/common';
import { loadJs } from './js';

export async function loadMjs<T>(path: Path): Promise<T> {
	return loadJs<T>(path);
}
