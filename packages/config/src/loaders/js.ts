import { Path } from '@boost/common';
import { importAbsoluteModule } from '@boost/internal';

// eslint-disable-next-line @typescript-eslint/require-await
export async function loadJs<T>(path: Path): Promise<T> {
	return importAbsoluteModule<T>(path.path());
}
