/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Status } from './types';

export const PENDING: Status = 'pending';
export const SKIPPED: Status = 'skipped';
export const PASSED: Status = 'passed';
export const FAILED: Status = 'failed';

export const DEFAULT_GLOBALS = {
  command: {
    name: '',
    options: [],
  },
  config: {
    debug: false,
  },
  package: {
    name: '',
    version: '',
  },
};
