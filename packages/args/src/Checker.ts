import ParseError from './ParseError';
import ValidationError from './ValidationError';
import {
  OptionConfig,
  ValueType,
  LongOptionName,
  ShortOptionName,
  AliasMap,
  OptionConfigMap,
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
      this.logFailure(
        `Command has been defined as "${providedCommand}", received another "${anotherCommand}".`,
      );
    } else if (positionalsLength !== 0) {
      this.logFailure('Command must be passed as the first non-option, non-positional argument.');
    }
  }

  checkFlagHasNoInlineValue(inlineValue?: string) {
    if (inlineValue !== undefined) {
      this.logFailure('Flags and flag groups may not use inline values.');
    }
  }

  checkFlagGroupIsBoolOption(name: LongOptionName, configs: OptionConfigMap) {
    if (!configs[name] || configs[name].type !== 'boolean') {
      this.logFailure('Only boolean options may use flag groups.');
    }
  }

  validateArityIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (!config.arity || !Array.isArray(value)) {
      return;
    }

    if (value.length > 0 && value.length !== config.arity) {
      this.logInvalid(
        `Not enough arity arguments. Require ${config.arity}, found ${value.length}.`,
        option,
      );
    }
  }

  validateDefaultValue(option: LongOptionName, value: unknown, config: OptionConfig) {
    if (config.multiple) {
      if (!Array.isArray(value)) {
        this.logInvalid(
          `Option "${option}" is enabled for multiple values, but non-array default value found.`,
          option,
        );
      }

      return;
    }

    if (config.type === 'boolean' && typeof value !== 'boolean') {
      this.logInvalid(
        `Option "${option}" is set to boolean, but non-boolean default value found.`,
        option,
      );
    }

    if (config.type === 'string' && typeof value !== 'string') {
      this.logInvalid(
        `Option "${option}" is set to string, but non-string default value found.`,
        option,
      );
    }

    if (config.type === 'number' && typeof value !== 'number') {
      this.logInvalid(
        `Option "${option}" is set to number, but non-number default value found.`,
        option,
      );
    }
  }

  validateChoiceIsMet(option: LongOptionName, config: OptionConfig, value: ValueType) {
    if (Array.isArray(config.choices) && !config.choices.includes(value as 'string')) {
      this.logInvalid(
        `Invalid value, must be one of ${config.choices.join(', ')}, found ${value}.`,
        option,
      );
    }
  }

  validateCommandFormat(command: string) {
    if (!COMMAND_FORMAT.test(command)) {
      this.logInvalid(`Invalid "${command}" command format. Must be letters, numbers, and dashes.`);
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

  validateParsedPositional(index: number, config: PositionalConfig, value: unknown) {
    if (config.validate) {
      try {
        config.validate(value);
      } catch (error) {
        this.logInvalid(error.message);
      }
    }

    if (config.required && value === undefined) {
      this.logInvalid(`Positional ${index} is required but value is undefined.`);
    }
  }

  validatePositionalOrder(configs: PositionalConfig[]) {
    const optionals: PositionalConfig[] = [];

    configs.forEach(config => {
      if (config.required) {
        if (optionals.length > 0) {
          const labels = optionals.map(opt => `"${opt.label}"`);

          this.logInvalid(
            `Optional positional(s) ${labels.join(', ')} found before required positional "${
              config.label
            }". Required must be first.`,
          );
        }
      } else {
        optionals.push(config);
      }
    });
  }

  validateUniqueShortName(option: LongOptionName, short: ShortOptionName, map: AliasMap) {
    if (map[short]) {
      this.logInvalid(
        `Short option "${short}" has already been defined for "${map[short]}".`,
        option,
      );
    }

    if (short.length !== 1) {
      this.logInvalid(`Short option "${short}" may only be a single letter.`, option);
    }
  }

  logFailure(message: string) {
    this.parseErrors.push(new ParseError(message, this.arg, this.argIndex));
  }

  logInvalid(message: string, option?: LongOptionName) {
    this.validationErrors.push(new ValidationError(message, option));
  }
}
