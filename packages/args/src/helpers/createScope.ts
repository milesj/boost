import { Scope } from '../Scope';
import { LongOptionName, OptionConfig, OptionMap } from '../types';

function camelCase(value: string): string {
	return value.replace(/-([a-z0-9])/giu, (match, char) => String(char).toUpperCase());
}

export function createScope(
	optionName: LongOptionName,
	optionConfigs: Record<string, OptionConfig>,
	options: OptionMap,
): Scope {
	let name = optionName;
	let negated = false;

	// Check for negated types
	if (name.startsWith('no-')) {
		negated = true;
		name = name.slice(3);
	}

	// Convert option to camel case
	if (name.includes('-')) {
		name = camelCase(name);
	}

	// Create scope
	const scope = new Scope(name, optionConfigs[name]);

	scope.negated = negated;

	// When capturing multiples, we need to persist the array
	// so we can append. Avoid using the default array though.
	if (scope.config.multiple) {
		scope.value = options[name] === scope.config.default ? [] : (options[name] as string);
	}

	return scope;
}
