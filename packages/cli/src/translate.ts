import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTranslator } from '@boost/translate';

export const msg = await createTranslator(
	['cli', 'prompt'],
	path.join(path.dirname(fileURLToPath(import.meta.url)), '../res'),
);
