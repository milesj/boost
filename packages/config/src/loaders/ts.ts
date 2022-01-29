import { Path } from '@boost/common';
import { requireTSModule } from '@boost/module';

// eslint-disable-next-line @typescript-eslint/require-await
export async function loadTs<T>(path: Path): Promise<T> {
	return requireTSModule(path).default as T;
}
