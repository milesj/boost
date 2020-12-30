/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import type { TranslatorOptions } from './createTranslator';
import createTranslator from './createTranslator';
import type { TranslateErrorCode } from './TranslateError';
import TranslateError from './TranslateError';

export * from './types';

export { createTranslator, TranslateError };
export type { TranslateErrorCode, TranslatorOptions };
