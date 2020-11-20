import path from 'path';
import { createTranslator } from '@boost/translate';

export default createTranslator(['cli', 'prompt'], path.join(__dirname, '../res'));
