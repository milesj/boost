import path from 'path';
import { createTranslator } from '@boost/translate';
import { ExitCode } from './types';

export const msg = createTranslator('cli', path.join(__dirname, '../res'));

export const META_CONFIG = Symbol('config');
export const META_COMMANDS = Symbol('commands');
export const META_OPTIONS = Symbol('options');
export const META_PARAMS = Symbol('params');
export const META_PATH = Symbol('path');
export const META_REST = Symbol('rest');

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
export const VERSION_FORMAT = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u;

export const EXIT_PASS: ExitCode = 0;
export const EXIT_FAIL: ExitCode = 1;
