import { createScopedError } from '@boost/internal';

const errors = {
  EXISTS_TYPE: 'Plugin type "%s" already exists.',
  INVALID_FACTORY: 'Plugin modules must export a default function, found %s.',
  INVALID_MODULE_NAME: 'A fully qualified module name is required for %s.',
  INVALID_REGISTER: '%s expect an object or class instance, found %s.',
  MISSING_PLUGIN: 'Failed to find %s "%s". Have you installed it?',
  MISSING_PLUGIN_NAME: 'Plugin object or class instance found without a `name` property.',
  MISSING_TYPE: 'Plugin type "%s" could not be found. Has it been registered?',
  UNKNOWN_MODULE_FORMAT: 'Unknown plugin module format: %s',
  UNKNOWN_SETTING: 'Unknown plugin setting: %s',
};

export type PluginErrorCode = keyof typeof errors;

export default createScopedError<PluginErrorCode>('PLG', 'PluginError', errors);
