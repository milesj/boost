import { optimal, Blueprint } from '@boost/common';
import { OptionConfig, OptionConfigMap } from '@boost/args';
import {
  flagBlueprint,
  numbersOptionBlueprint,
  numberOptionBlueprint,
  stringsOptionBlueprint,
  stringOptionBlueprint,
} from './blueprints';

export default function validateOptions<T extends OptionConfigMap>(options: T): T {
  return Object.entries(options).reduce((object, [name, config]) => {
    let blueprint: Blueprint<object>;

    if (config.type === 'boolean') {
      blueprint = flagBlueprint;
    } else if (config.type === 'number') {
      blueprint = config.multiple ? numbersOptionBlueprint : numberOptionBlueprint;
    } else {
      blueprint = config.multiple ? stringsOptionBlueprint : stringOptionBlueprint;
    }

    return {
      ...object,
      [name]: optimal(config, blueprint as Blueprint<OptionConfig>, {
        name: `Option "${name}"`,
        unknown: false,
      }),
    };
  }, {}) as T;
}
