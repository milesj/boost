import { Path, requireModule } from '@boost/common';

export default function loadJs<T>(path: Path): Promise<Partial<T>> {
  return Promise.resolve(requireModule(path));
}
