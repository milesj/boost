import path from 'path';
import factoryDebug from 'debug';
import { createTranslator } from '@boost/translate';
import { LogLevel } from './types';

export const debug = factoryDebug('boost:log');

export const msg = createTranslator('log', path.join(__dirname, '../res'));

// In order of priority!
export const LOG_LEVELS: LogLevel[] = ['log', 'trace', 'debug', 'info', 'warn', 'error'];
