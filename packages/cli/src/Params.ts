import 'reflect-metadata';
import { MapParamConfig, PrimitiveType } from '@boost/args';
import { META_PARAMS } from './constants';

export default function Params<T extends PrimitiveType[] = string[]>(...config: MapParamConfig<T>) {
  return (target: Object, property: string) => {
    Reflect.defineMetadata(
      META_PARAMS,
      {
        config,
        property,
      },
      target,
    );
  };
}
