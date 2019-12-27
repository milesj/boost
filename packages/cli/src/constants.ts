import path from 'path';
import { createTranslator } from '@boost/translate';

export const msg = createTranslator('cli', path.join(__dirname, '../res'));

export const META_CONFIG = Symbol('name');
export const META_COMMANDS = Symbol('commands');
export const META_OPTIONS = Symbol('options');
export const META_PARAMS = Symbol('params');
export const META_PATH = Symbol('path');
export const META_REST = Symbol('rest');
