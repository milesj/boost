import { RuntimeError } from '@boost/internal';
import ParseError from './ParseError';
import ValidationError from './ValidationError';
import {
  OptionConfig,
  ValueType,
  LongOptionName,
  ShortOptionName,
  AliasMap,
  PositionalConfig,
} from './types';
import { COMMAND_FORMAT } from './constants';

export default class Checker {
  arg: string = '';

  argIndex: number = 0;

  parseErrors: ParseError[] = [];

  validationErrors: ValidationError[] = [];

  checkCommandOrder(anotherCommand: string, providedCommand: string, positionalsLength: number) {
    if (providedCommand !== '') {
      this.logFailure('AG_COMMAND_PROVIDED', [providedCommand, anotherCommand]);
    } else if (positionalsLength !== 0) {
      this.logFailure('AG_COMMAND_NOT_FIRST');
    }
  }

  checkNoInlineValue(inlineValue?: string) {
    if (inlineValue !== undefined) {
      this.logFailure('AG_VALUE_NO_INLINE');
    }
  }

  validateArityIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (!config.arity || !Array.isArray(value)) {
      return;
    }

    if (value.length > 0 && value.length !== config.arity) {
      this.logInvalid('AG_VALUE_ARITY_UNMET', option, [config.arity, value.length]);
    }
  }

  validateDefaultValue(option: LongOptionName, value: unknown, config: OptionConfig) {
    if (config.multiple) {
      if (!Array.isArray(value)) {
        this.logInvalid('AG_VALUE_NON_ARRAY', option, [option]);
      }

      return;
    }

    if (config.type === 'boolean' && typeof value !== 'boolean') {
      this.logInvalid('AG_VALUE_NON_BOOL', option, [option]);
    }

    if (config.type === 'number' && typeof value !== 'number') {
      this.logInvalid('AG_VALUE_NON_NUMBER', option, [option]);
    }

    if (config.type === 'string' && typeof value !== 'string') {
      this.logInvalid('AG_VALUE_NON_STRING', option, [option]);
    }
  }

  validateChoiceIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (Array.isArray(config.choices) && !config.choices.includes(value as 'string')) {
      this.logInvalid('AG_VALUE_INVALID_CHOICE', option, [config.choices.join(', '), value]);
    }
  }

  validateCommandFormat(command: string) {
    if (!COMMAND_FORMAT.test(command)) {
      this.logInvalid('AG_COMMAND_INVALID_FORMAT', '', [command]);
    }
  }

  validateNumberCount(option: LongOptionName, config: OptionConfig) {
    if (config.count && config.type !== 'number') {
      this.logInvalid('AG_OPTION_NUMBER_COUNT', option);
    }
  }

  validateParsedOption(option: LongOptionName, config: OptionConfig, value: unknown) {
    if (config.validate) {
      try {
        config.validate(value);
      } catch (error) {
        this.validationErrors.push(new ValidationError(error.message, option));
      }
    }
  }

  validateParsedPositional(config: PositionalConfig, value: unknown) {
    if (config.validate) {
      try {
        config.validate(value);
      } catch (error) {
        this.validationErrors.push(new ValidationError(error.message));
      }
    }

    if (config.required && value === undefined) {
      this.logInvalid('AG_POSITIONAL_REQUIRED', '', [config.label]);
    }
  }

  validatePositionalOrder(configs: PositionalConfig[]) {
    const optionals: PositionalConfig[] = [];

    configs.forEach(config => {
      if (config.required) {
        if (optionals.length > 0) {
          const labels = optionals.map(opt => `"${opt.label}"`);

          this.logInvalid('AG_POSITIONAL_MISORDERED', '', [labels.join(', '), config.label]);
        }
      } else {
        optionals.push(config);
      }
    });
  }

  validateUniqueShortName(option: LongOptionName, short: ShortOptionName, map: AliasMap) {
    if (map[short]) {
      this.logInvalid('AG_SHORT_DEFINED', option, [short, map[option]]);
    }

    if (short.length !== 1) {
      this.logInvalid('AG_SHORT_SINGLE_CHAR', option, [short]);
    }
  }

  logFailure(module: string, args?: unknown[]) {
    this.parseErrors.push(
      new ParseError(new RuntimeError('args', module, args).message, this.arg, this.argIndex),
    );
  }

  logInvalid(module: string, option?: LongOptionName, args?: unknown[]) {
    this.validationErrors.push(
      new ValidationError(new RuntimeError('args', module, args).message, option),
    );
  }
}
