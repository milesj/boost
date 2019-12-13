import 'reflect-metadata';
import { ParamConfig } from '@boost/args';
import { META_PARAMS } from '../constants';

export default function registerParams<T extends Object>(
  target: T,
  property: keyof T,
  config: ParamConfig[],
) {
  Reflect.defineMetadata(
    META_PARAMS,
    {
      config,
      property,
    },
    target,
  );
}
