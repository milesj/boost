import { PackageConfig } from '@boost/core';
import { TestToolConfig } from './types';

export function stubArgs(fields: object = {}): any {
  return {
    $0: '',
    _: [],
    ...fields,
  };
}

export function stubPackageJson(fields: Partial<PackageConfig> = {}): PackageConfig {
  return {
    name: 'test-boost',
    version: '0.0.0',
    ...fields,
  };
}

export function stubToolConfig(config: Partial<TestToolConfig> = {}): TestToolConfig {
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
    ...config,
  };
}
