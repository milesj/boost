import 'reflect-metadata';
import { OptionConfig } from '@boost/args';
import { META_OPTIONS } from '../constants';
import { CommandMetadata } from '../types';

export default function registerOption<T extends Object>(
  target: T,
  property: keyof T,
  config: OptionConfig,
) {
  const options: CommandMetadata['options'] = Reflect.getMetadata(META_OPTIONS, target) ?? {};
  const name = String(property);

  options[name] = config;

  Reflect.defineMetadata(META_OPTIONS, options, target);
}
