import path from 'path';
import { createTranslator } from '@boost/translate';

export const msg = createTranslator('cli', path.join(__dirname, '../res'));

export const META_NAME = Symbol('name');
export const META_OPTIONS = Symbol('options');
export const META_PARAMS = Symbol('params');
export const META_REST = Symbol('rest');
export const META_COMMANDS = Symbol('commands');
