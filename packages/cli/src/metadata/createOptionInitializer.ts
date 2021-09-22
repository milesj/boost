import { Option } from '@boost/args';
import { INTERNAL_INITIALIZER } from '../constants';
import { OptionInitializer } from '../types';
import { registerOption } from './registerOption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOptionInitializer<O extends Option<any>, Return = unknown>(
	config: O,
): Return {
	const initializer: OptionInitializer = {
		[INTERNAL_INITIALIZER]: true,
		register(target, property) {
			registerOption(target, property, config);
		},
		value: config.default,
	};

	// We are being very tricky here! Initializers actually return an object (above)
	// that registers the option when the command is instantiated, instead of
	// returning the actual primitive value. We do this so that consumers are typed
	// correctly, but don't fret, we set the correct value after instantiation.
	return initializer as unknown as Return;
}
