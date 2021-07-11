import { Option } from '@boost/args';
import { registerOption } from './registerOption';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOptionDecorator<O extends Option<any>>(config: O): PropertyDecorator {
	return (target, name) => {
		registerOption(target, name, config);
	};
}
