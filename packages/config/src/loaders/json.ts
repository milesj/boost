import { Path, json } from '@boost/common';
import readFile from '../helpers/readFile';

export default function loadJson<T>(path: Path): Promise<T> {
  return readFile(path).then((data) => json.parse(data));
}
