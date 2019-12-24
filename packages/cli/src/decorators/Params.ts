import 'reflect-metadata';
import { MapParamConfig, PrimitiveType, ParamConfig } from '@boost/args';
import registerParams from '../metadata/registerParams';

export default function Params<T extends PrimitiveType[] = string[]>(...config: MapParamConfig<T>) {
  // Method
  return <T extends Object>(target: T, method: keyof T) => {
    registerParams(target, method, config as ParamConfig[]);
  };
}
