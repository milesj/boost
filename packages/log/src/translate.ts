import path from 'path';
import { createTranslator } from '@boost/translate';

export default createTranslator('log', path.join(__dirname, '../res'));
