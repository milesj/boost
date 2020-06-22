import { createScopedError } from '@boost/internal';

const errors = {
  FACTORY_REQUIRED: 'Plugin modules must export a default function, found %s.',
  MODULE_NAME_INVALID: 'A fully qualified module name is required for %s.',
  MODULE_UNKNOWN_FORMAT: 'Unknown plugin module format "%s".',
  PLUGIN_REQUIRED: 'Failed to find %s "%s". Have you installed it?',
  PLUGIN_REQUIRED_NAME: 'Plugin object or class instance found without a `name` property.',
  REGISTER_REQUIRED: '%s expect an object or class instance, found %s.',
  SETTING_UNKNOWN: 'Unknown plugin setting "%s".',
};

export type PluginErrorCode = keyof typeof errors;

export default createScopedError<PluginErrorCode>('PLG', 'PluginError', errors);
