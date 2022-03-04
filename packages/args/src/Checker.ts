import levenary from 'levenary';
import { ArgsError, ArgsErrorCode } from './ArgsError';
import { COMMAND_FORMAT } from './constants';
import { ParseError } from './ParseError';
import {
	AliasMap,
	LongOptionName,
	OptionConfig,
	OptionConfigMap,
	ParamConfig,
	ShortOptionName,
	ValueType,
} from './types';
import { ValidationError } from './ValidationError';

export class Checker {
	arg: string = '';

	argIndex: number = 0;

	options: OptionConfigMap;

	parseErrors: ParseError[] = [];

	validationErrors: ValidationError[] = [];

	constructor(options: OptionConfigMap) {
		this.options = options;
	}

	checkCommandOrder(anotherCommand: string, providedCommand: string, paramsLength: number) {
		if (providedCommand !== '') {
			this.logFailureError('COMMAND_PROVIDED', [providedCommand, anotherCommand]);
		} else if (paramsLength !== 0) {
			this.logFailureError('COMMAND_NOT_FIRST');
		}
	}

	checkNoInlineValue(inlineValue?: string) {
		if (inlineValue !== undefined) {
			this.logFailureError('VALUE_NO_INLINE');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	checkUnknownOption(option: LongOptionName | ShortOptionName) {
		const guess = levenary(option, Object.keys(this.options));

		if (guess) {
			this.logFailureError('OPTION_UNKNOWN_MORE', [option, guess]);
		} else {
			this.logFailureError('OPTION_UNKNOWN', [option]);
		}
	}

	validateArityIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
		if (!config.arity || !Array.isArray(value)) {
			return;
		}

		if (value.length > 0 && value.length !== config.arity) {
			this.logInvalidError('VALUE_INVALID_ARITY', [config.arity, value.length], option);
		}
	}

	validateDefaultValue(option: LongOptionName, value: unknown, config: OptionConfig) {
		if (config.multiple) {
			if (!Array.isArray(value)) {
				this.logInvalidError('VALUE_NON_ARRAY', [option], option);
			}

			return;
		}

		if (config.type === 'boolean' && typeof value !== 'boolean') {
			this.logInvalidError('VALUE_NON_BOOL', [option], option);
		}

		if (config.type === 'number' && typeof value !== 'number') {
			this.logInvalidError('VALUE_NON_NUMBER', [option], option);
		}

		if (config.type === 'string' && typeof value !== 'string') {
			this.logInvalidError('VALUE_NON_STRING', [option], option);
		}
	}

	validateChoiceIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
		if (value && Array.isArray(config.choices) && !config.choices.includes(value as 'string')) {
			this.logInvalidError(
				'VALUE_INVALID_CHOICE',
				[config.choices.join(', '), value || '""'],
				option,
			);
		}
	}

	validateCommandFormat(command: string) {
		if (!COMMAND_FORMAT.test(command)) {
			this.logInvalidError('COMMAND_INVALID_FORMAT', [command]);
		}
	}

	validateNumberCount(option: LongOptionName, config: OptionConfig) {
		if (config.count && config.type !== 'number') {
			this.logInvalidError('OPTION_INVALID_COUNT_TYPE', [], option);
		}
	}

	validateParsedOption(option: LongOptionName, config: OptionConfig, value: unknown) {
		if (config.validate) {
			try {
				config.validate(value);
			} catch (error: unknown) {
				this.logInvalid((error as Error).message, option);
			}
		}
	}

	validateParsedParam(config: ParamConfig, value: unknown) {
		if (config.validate) {
			try {
				config.validate(value);
			} catch (error: unknown) {
				this.logInvalid((error as Error).message);
			}
		}

		if (config.required && value === undefined) {
			this.logInvalidError('PARAM_REQUIRED', [config.label]);
		}
	}

	validateParamOrder(configs: ParamConfig[]) {
		const optionals: ParamConfig[] = [];

		configs.forEach((config) => {
			if (config.required) {
				if (optionals.length > 0) {
					const labels = optionals.map((opt) => `"${opt.label}"`);

					this.logInvalidError('PARAM_INVALID_ORDER', [labels.join(', '), config.label]);
				}
			} else {
				optionals.push(config);
			}
		});
	}

	validateRequiredParamNoDefault(config: ParamConfig) {
		if (config.required && config.default !== undefined) {
			this.logInvalidError('PARAM_REQUIRED_NO_DEFAULT', [config.label]);
		}
	}

	validateUniqueShortName(option: LongOptionName, short: ShortOptionName, map: AliasMap) {
		if (map[short]) {
			this.logInvalidError('SHORT_DEFINED', [short, map[short]], option);
		}

		if (short.length !== 1) {
			this.logInvalidError('SHORT_INVALID_CHAR', [short], option);
		}
	}

	logFailureError(code: ArgsErrorCode, args?: unknown[]) {
		this.logFailure(new ArgsError(code, args).message);
	}

	logFailure(message: string) {
		this.parseErrors.push(new ParseError(message, this.arg, this.argIndex));
	}

	logInvalidError(code: ArgsErrorCode, args?: unknown[], option?: LongOptionName) {
		this.logInvalid(new ArgsError(code, args).message, option);
	}

	logInvalid(message: string, option?: LongOptionName) {
		this.validationErrors.push(new ValidationError(message, option));
	}
}
