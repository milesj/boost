import { Path } from '@boost/common';
import { requireModule } from '@boost/module';

export async function loadCjs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireModule(path).default as T);
}
