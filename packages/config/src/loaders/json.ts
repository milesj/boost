import fs from 'fs';
import { json, Path } from '@boost/common';

export default function loadJson<T>(path: Path): Promise<T> {
	return fs.promises.readFile(path.path(), 'utf8').then((data) => json.parse(data));
}
