import { Path, json } from '@boost/common';
import readFile from '../readFile';

export default function loadJson<T>(path: Path): Promise<Partial<T>> {
  return readFile(path).then(data => json.parse(data));
}