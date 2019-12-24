import 'reflect-metadata';
import { MapParamConfig, PrimitiveType, ParamConfig } from '@boost/args';
import registerParams from '../metadata/registerParams';

export default function Params<T extends PrimitiveType[] = string[]>(...config: MapParamConfig<T>) {
  // Property
  return <T extends Object>(target: T, property: keyof T) => {
    registerParams(target, property, config as ParamConfig[]);
  };
}
