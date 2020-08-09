/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import createTranslator from './createTranslator';
import type { TranslatorOptions } from './createTranslator';
import TranslateError from './TranslateError';
import type { TranslateErrorCode } from './TranslateError';

export * from './types';

export { createTranslator, TranslateError };
export type { TranslatorOptions, TranslateErrorCode };
