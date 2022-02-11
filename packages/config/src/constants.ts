import { ExtType } from './types';

export const CONFIG_FOLDER = '.config';

export const ROOT_CONFIG_DIR_REGEX = /\.config([/\\])([\d.a-z]+)\.([\da-z]{2,5})$/i;

export const ROOT_CONFIG_FILE_REGEX = /([\da-z]+)\.config\.([\da-z]{2,5})$/i;

export const PACKAGE_FILE = 'package.json';

export const DEFAULT_EXTS: ExtType[] = ['js', 'json', 'cjs', 'mjs', 'ts', 'json5', 'yaml', 'yml'];
