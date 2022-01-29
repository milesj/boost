import { Path } from '@boost/common';
import { requireModule } from '@boost/module';

// eslint-disable-next-line @typescript-eslint/require-await
export async function loadCjs<T>(path: Path): Promise<T> {
	return requireModule(path).default as T;
}
