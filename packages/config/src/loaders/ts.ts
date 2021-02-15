import { Path, requireTypedModule } from '@boost/common';

export default function loadTs<T>(path: Path): Promise<T> {
  return Promise.resolve(requireTypedModule(path));
}
