import path from 'path';
import { createTranslator } from '@boost/translate';

export const msg = createTranslator(
	['cli', 'prompt'],
	path.join(path.dirname(import.meta.url), '../res'),
);
