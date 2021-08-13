import { MapParamConfig, ParamConfig, PrimitiveType } from '@boost/args';
import { registerParams } from '../metadata/registerParams';

/**
 * A method decorator for declaring command line parameters (positional arguments).
 */
export function Params<T extends PrimitiveType[] = string[]>(
	...config: MapParamConfig<T>
): MethodDecorator {
	return (target, method) => {
		registerParams(target, method, config as ParamConfig[]);
	};
}
