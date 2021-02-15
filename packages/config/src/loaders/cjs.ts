import { Path, requireModule } from '@boost/common';

export default function loadCjs<T>(path: Path): Promise<T> {
  return Promise.resolve(requireModule(path));
}
