import 'reflect-metadata';
import { ParamConfig } from '@boost/args';
import { META_PARAMS } from '../constants';
import { CommandMetadata } from '../types';

export default function registerParams<T extends Object>(
  target: T,
  property: keyof T,
  config: ParamConfig[],
) {
  const metadata: CommandMetadata['params'] = { config, property: String(property) };

  Reflect.defineMetadata(META_PARAMS, metadata, target);
}
