import { OptionConfig } from '@boost/args';
import { CLIError } from '../CLIError';
import { RESERVED_OPTIONS } from '../constants';
import { getConstructor } from './getConstructor';

export function registerOption<O extends OptionConfig>(
	target: Object,
	property: string | symbol,
	config: O,
) {
	const ctor = getConstructor(target);
	const { name } = ctor as unknown as Function;
	const key = String(property);

	// Without this check we would mutate the prototype chain,
	// resulting in *all* sub-classes inheriting the same options.
	// We use the constructor name so that deep inheritance still works.
	if (ctor.hasRegisteredOptions !== name) {
		ctor.options = {};
		ctor.hasRegisteredOptions = name;
	}

	if (RESERVED_OPTIONS.includes(key)) {
		throw new CLIError('OPTION_RESERVED', [key]);
	}

	ctor.options[key] = config;
}
