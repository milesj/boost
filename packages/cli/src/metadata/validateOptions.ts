import { optimal, Blueprint } from '@boost/common';
import { OptionConfig, OptionConfigMap } from '@boost/args';
import {
  flagBlueprint,
  numbersOptionBlueprint,
  numberOptionBlueprint,
  stringsOptionBlueprint,
  stringOptionBlueprint,
} from './blueprints';

export default function validateOptions(options: OptionConfigMap) {
  Object.entries(options).forEach(([name, config]) => {
    let blueprint: Blueprint<object>;

    if (config.type === 'boolean') {
      blueprint = flagBlueprint;
    } else if (config.type === 'number') {
      blueprint = config.multiple ? numbersOptionBlueprint : numberOptionBlueprint;
    } else {
      blueprint = config.multiple ? stringsOptionBlueprint : stringOptionBlueprint;
    }

    optimal(config, blueprint as Blueprint<OptionConfig>, {
      name: `Option "${name}"`,
      unknown: false,
    });
  });
}
