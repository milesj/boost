import { ArgList, Arguments, Argv, OptionMap, ValueType } from './types';

function mapToStringList(value: ValueType): ArgList {
	if (!Array.isArray(value)) {
		return [String(value)];
	}

	return (value as string[]).map(String);
}

/**
 * Format a parsed arguments object back into a command line list of arguments.
 */
export function format(argument: Partial<Arguments<OptionMap, ArgList>>): Argv {
	const { command = [], options = {}, params = [], rest = [] } = argument;
	const args: Argv = [];

	// Commands
	if (command.length > 0) {
		args.push(command.join(':'));
	}

	// Options
	Object.entries(options).forEach(([name, value]) => {
		if (typeof value === 'boolean') {
			args.push(`--${value ? '' : 'no-'}${name}`);
		} else {
			args.push(`--${name}`, ...mapToStringList(value));
		}
	});

	// Params
	if (params.length > 0) {
		args.push(...mapToStringList(params));
	}

	// Rest
	if (rest.length > 0) {
		args.push('--', ...mapToStringList(rest));
	}

	return args;
}
