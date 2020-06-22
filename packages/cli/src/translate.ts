import path from 'path';
import { createTranslator } from '@boost/translate';

export default createTranslator('cli', path.join(__dirname, '../res'));
