import { Path, requireModule } from '@boost/common';

export async function loadCjs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireModule(path));
}
