import {
	OptionConfig,
	OptionMap,
	ParamConfig,
	ParserOptions,
	PrimitiveType,
	ValueType,
} from '../types';

export function mapParserOptions<O extends object, P extends PrimitiveType[]>(
	configs: ParserOptions<O, P>,
	options: OptionMap,
	params: ValueType[],
	{
		onCommand,
		onOption,
		onParam,
	}: {
		onCommand?: (command: string) => void;
		onOption?: (config: OptionConfig, value: ValueType, name: string) => void;
		onParam?: (config: ParamConfig, value: ValueType, index: number) => void;
	},
) {
	if (onCommand && Array.isArray(configs.commands)) {
		configs.commands.forEach((command) => {
			onCommand(command);
		});
	}

	if (onOption) {
		Object.keys(configs.options).forEach((name) => {
			onOption(configs.options[name as keyof O], options[name], name);
		});
	}

	if (onParam && configs.params) {
		configs.params.forEach((config, i) => {
			onParam(config, params[i], i);
		});
	}
}
