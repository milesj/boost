import 'reflect-metadata';
import { OptionConfig } from '@boost/args';
import { optimal, Blueprint } from '@boost/common';
import { META_OPTIONS } from '../constants';
import { CommandMetadata } from '../types';
import {
  flagBlueprint,
  numbersOptionBlueprint,
  numberOptionBlueprint,
  stringsOptionBlueprint,
  stringOptionBlueprint,
} from './blueprints';

export default function registerOption<O extends OptionConfig>(
  baseTarget: Object,
  property: string | symbol,
  config: O,
  // Decorators apply metadata to the prototype, while `Command#registerOptions`
  // apply to the instance. Because of this, we need to extract the prototype for the latter.
  prototype: boolean = false,
) {
  const target = prototype ? Object.getPrototypeOf(baseTarget) : baseTarget;
  const options: CommandMetadata['options'] = Reflect.getMetadata(META_OPTIONS, target) ?? {};
  const name = String(property);
  let blueprint: Blueprint<object>;

  if (config.type === 'boolean') {
    blueprint = flagBlueprint;
  } else if (config.type === 'number') {
    blueprint = config.multiple ? numbersOptionBlueprint : numberOptionBlueprint;
  } else {
    blueprint = config.multiple ? stringsOptionBlueprint : stringOptionBlueprint;
  }

  options[name] = optimal(config, blueprint as Blueprint<O>, {
    name: `Option "${name}"`,
    unknown: false,
  });

  Reflect.defineMetadata(META_OPTIONS, options, target);
}
