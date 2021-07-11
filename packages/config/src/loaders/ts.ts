import { Path, requireTypedModule } from '@boost/common';

export default async function loadTs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireTypedModule(path));
}
