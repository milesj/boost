import fs from 'fs';
import { Path, yaml } from '@boost/common';

export default async function loadYaml<T>(path: Path): Promise<T> {
	return fs.promises.readFile(path.path(), 'utf8').then((data) => yaml.parse(data));
}
