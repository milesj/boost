import fs from 'fs';
import { json, Path } from '@boost/common';

export async function loadJson<T>(path: Path): Promise<T> {
	return json.parse(await fs.promises.readFile(path.path(), 'utf8'));
}
