/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { Status, ToolConfig, PackageConfig } from './types';

export const PENDING: Status = 'pending';
export const RUNNING: Status = 'running';
export const SKIPPED: Status = 'skipped';
export const PASSED: Status = 'passed';
export const FAILED: Status = 'failed';

export const DEFAULT_TOOL_CONFIG: ToolConfig = {
  debug: false,
  dry: false,
  extends: [],
  plugins: [],
};

export const DEFAULT_PACKAGE_CONFIG: PackageConfig = {
  name: '',
  version: '',
};

export const RESTRICTED_CONFIG_KEYS: string[] = ['debug', 'dry', 'extends', 'plugins'];
