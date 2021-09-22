import { MapParamConfig, PrimitiveType } from '@boost/args';

/**
 * A property initializer for declaring command line parameters (positional arguments).
 */
export function params<T extends PrimitiveType[] = string[]>(
	...config: MapParamConfig<T>
): MapParamConfig<T> {
	// This exists for type checking and convenience
	return config;
}
