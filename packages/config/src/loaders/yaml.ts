import { Path, yaml } from '@boost/common';
import readFile from '../readFile';

export default function loadYaml<T>(path: Path): Promise<T> {
  return readFile(path).then(data => yaml.parse(data));
}
