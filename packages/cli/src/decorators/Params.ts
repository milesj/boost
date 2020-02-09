import 'reflect-metadata';
import { MapParamConfig, PrimitiveType, ParamConfig } from '@boost/args';
import registerParams from '../metadata/registerParams';

export default function Params<T extends PrimitiveType[] = string[]>(
  ...config: MapParamConfig<T>
): MethodDecorator {
  return (target, method) => {
    registerParams(target, method, config as ParamConfig[]);
  };
}
