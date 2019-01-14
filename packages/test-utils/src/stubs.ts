/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { PackageConfig } from '@boost/core';
import { TestToolConfig } from './types';

export function stubArgs(fields: object = {}): any {
  return {
    $0: '',
    _: [],
    ...fields,
  };
}

export function stubPackageJson(
  name: string = '',
  fields: Partial<PackageConfig> = {},
): PackageConfig {
  return {
    name,
    version: '0.0.0',
    ...fields,
  };
}

export function stubToolConfig(): TestToolConfig {
  return {
    debug: false,
    extends: [],
    locale: '',
    output: 2,
    plugins: [],
    reporters: [],
    settings: {},
    silent: false,
    theme: 'default',
  };
}
