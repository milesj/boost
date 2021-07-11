import { Path, requireModule } from '@boost/common';

export default async function loadCjs<T>(path: Path): Promise<T> {
	return Promise.resolve(requireModule(path));
}
