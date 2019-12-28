import 'reflect-metadata';
import { Option } from '@boost/args';
import { optimal, Blueprint } from '@boost/common';
import { META_OPTIONS } from '../constants';
import { CommandMetadata } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function registerOption<T extends Object, O extends Option<any>>(
  target: T,
  property: keyof T,
  config: O,
  blueprint: Blueprint<O>,
) {
  const options: CommandMetadata['options'] = Reflect.getMetadata(META_OPTIONS, target) ?? {};
  const name = String(property);

  options[name] = optimal(config, blueprint, {
    name: `--${property}`,
    unknown: false,
  });

  Reflect.defineMetadata(META_OPTIONS, options, target);
}
