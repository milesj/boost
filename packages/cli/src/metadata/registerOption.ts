import 'reflect-metadata';
import { OptionConfig, OptionConfigMap } from '@boost/args';
import { META_OPTIONS } from '../constants';

export default function registerOption<T extends Object>(
  target: T,
  property: keyof T,
  config: OptionConfig,
) {
  const options: OptionConfigMap = Reflect.getMetadata(META_OPTIONS, target) ?? {};
  const name = String(property);

  options[name] = config;

  Reflect.defineMetadata(META_OPTIONS, options, target);

  console.log('Option', { property, target, config, options });
}
