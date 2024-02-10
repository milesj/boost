import path from 'node:path';
import { createTranslator } from '@boost/translate';

export const msg = createTranslator(['cli', 'prompt'], path.join(__dirname, '../res'));
