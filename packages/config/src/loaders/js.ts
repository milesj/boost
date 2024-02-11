import { Path } from '@boost/common';
import { importAbsoluteModule } from '@boost/internal';

export async function loadJs<T>(path: Path): Promise<T> {
	return importAbsoluteModule<T>(path.path());
}
