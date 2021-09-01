import { Path } from '@boost/common';
import { requireTSModule } from '@boost/module';

export async function loadTs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireTSModule(path).default as T);
}
