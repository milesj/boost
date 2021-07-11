import { Path, requireTypedModule } from '@boost/common';

export async function loadTs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireTypedModule(path));
}
