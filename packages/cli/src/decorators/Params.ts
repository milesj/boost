import { MapParamConfig, ParamConfig, PrimitiveType } from '@boost/args';
import registerParams from '../metadata/registerParams';

export default function Params<T extends PrimitiveType[] = string[]>(
  ...config: MapParamConfig<T>
): MethodDecorator {
  return (target, method) => {
    registerParams(target, method, config as ParamConfig[]);
  };
}
