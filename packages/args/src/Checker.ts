import { RuntimeError } from '@boost/internal';
import levenary from 'levenary';
import ParseError from './ParseError';
import ValidationError from './ValidationError';
import {
  OptionConfig,
  ValueType,
  LongOptionName,
  ShortOptionName,
  AliasMap,
  ParamConfig,
  OptionConfigMap,
} from './types';
import { COMMAND_FORMAT } from './constants';

export default class Checker {
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
      this.logFailureError('AG_COMMAND_PROVIDED', [providedCommand, anotherCommand]);
    } else if (paramsLength !== 0) {
      this.logFailureError('AG_COMMAND_NOT_FIRST');
    }
  }

  checkNoInlineValue(inlineValue?: string) {
    if (inlineValue !== undefined) {
      this.logFailureError('AG_VALUE_NO_INLINE');
    }
  }

  checkUnknownOption(option: ShortOptionName | LongOptionName) {
    const guess = levenary(option, Object.keys(this.options));

    if (guess) {
      this.logFailureError('AG_OPTION_UNKNOWN_MORE', [option, guess]);
    } else {
      this.logFailureError('AG_OPTION_UNKNOWN', [option]);
    }
  }

  validateArityIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (!config.arity || !Array.isArray(value)) {
      return;
    }

    if (value.length > 0 && value.length !== config.arity) {
      this.logInvalidError('AG_VALUE_ARITY_UNMET', [config.arity, value.length], option);
    }
  }

  validateDefaultValue(option: LongOptionName, value: unknown, config: OptionConfig) {
    if (config.multiple) {
      if (!Array.isArray(value)) {
        this.logInvalidError('AG_VALUE_NON_ARRAY', [option], option);
      }

      return;
    }

    if (config.type === 'boolean' && typeof value !== 'boolean') {
      this.logInvalidError('AG_VALUE_NON_BOOL', [option], option);
    }

    if (config.type === 'number' && typeof value !== 'number') {
      this.logInvalidError('AG_VALUE_NON_NUMBER', [option], option);
    }

    if (config.type === 'string' && typeof value !== 'string') {
      this.logInvalidError('AG_VALUE_NON_STRING', [option], option);
    }
  }

  validateChoiceIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (Array.isArray(config.choices) && !config.choices.includes(value as 'string')) {
      this.logInvalidError(
        'AG_VALUE_INVALID_CHOICE',
        [config.choices.join(', '), value || '""'],
        option,
      );
    }
  }

  validateCommandFormat(command: string) {
    if (!COMMAND_FORMAT.test(command)) {
      this.logInvalidError('AG_COMMAND_INVALID_FORMAT', [command]);
    }
  }

  validateNumberCount(option: LongOptionName, config: OptionConfig) {
    if (config.count && config.type !== 'number') {
      this.logInvalidError('AG_OPTION_NUMBER_COUNT', [], option);
    }
  }

  validateParsedOption(option: LongOptionName, config: OptionConfig, value: unknown) {
    if (config.validate) {
      try {
        config.validate(value);
      } catch (error) {
        this.logInvalid(error.message, option);
      }
    }
  }

  validateParsedParam(config: ParamConfig, value: unknown) {
    if (config.validate) {
      try {
        config.validate(value);
      } catch (error) {
        this.logInvalid(error.message);
      }
    }

    if (config.required && value === undefined) {
      this.logInvalidError('AG_PARAM_REQUIRED', [config.label]);
    }
  }

  validateParamOrder(configs: ParamConfig[]) {
    const optionals: ParamConfig[] = [];

    configs.forEach((config) => {
      if (config.required) {
        if (optionals.length > 0) {
          const labels = optionals.map((opt) => `"${opt.label}"`);

          this.logInvalidError('AG_PARAM_MISORDERED', [labels.join(', '), config.label]);
        }
      } else {
        optionals.push(config);
      }
    });
  }

  validateRequiredParamNoDefault(config: ParamConfig) {
    if (config.required && config.default !== undefined) {
      this.logInvalidError('AG_PARAM_REQUIRED_NO_DEFAULT', [config.label]);
    }
  }

  validateUniqueShortName(option: LongOptionName, short: ShortOptionName, map: AliasMap) {
    if (map[short]) {
      this.logInvalidError('AG_SHORT_DEFINED', [short, map[short]], option);
    }

    if (short.length !== 1) {
      this.logInvalidError('AG_SHORT_SINGLE_CHAR', [short], option);
    }
  }

  logFailureError(module: string, args?: unknown[]) {
    this.logFailure(new RuntimeError('args', module, args).message);
  }

  logFailure(message: string) {
    this.parseErrors.push(new ParseError(message, this.arg, this.argIndex));
  }

  logInvalidError(module: string, args?: unknown[], option?: LongOptionName) {
    this.logInvalid(new RuntimeError('args', module, args).message, option);
  }

  logInvalid(message: string, option?: LongOptionName) {
    this.validationErrors.push(new ValidationError(message, option));
  }
}
