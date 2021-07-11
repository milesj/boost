import { createScopedError } from '@boost/internal';

const errors = {
	FACTORY_REQUIRED: 'Plugin modules must export a default function, found {0}.',
	MODULE_NAME_INVALID: 'A fully qualified module name is required for {0}.',
	MODULE_UNKNOWN_FORMAT: 'Unknown plugin module format "{0}".',
	PLUGIN_REQUIRED: 'Failed to find {0} "{1}". Have you installed it?',
	PLUGIN_REQUIRED_NAME: 'Plugin object or class instance found without a `name` property.',
	REGISTER_REQUIRED: '{0} expect an object or class instance, found {1}.',
	SETTING_UNKNOWN: 'Unknown plugin setting "{0}".',
};

export type PluginErrorCode = keyof typeof errors;

export default createScopedError<PluginErrorCode>('PLG', 'PluginError', errors);
