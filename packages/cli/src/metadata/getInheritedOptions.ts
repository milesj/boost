/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { OptionConfigMap } from '@boost/args';
import { getConstructor } from './getConstructor';

export function getInheritedOptions(base: Object): OptionConfigMap {
	const options: OptionConfigMap = {};
	let target = Object.getPrototypeOf(base);

	while (target) {
		const ctor = getConstructor(target);

		if (ctor.options) {
			Object.assign(options, ctor.options);
		} else {
			break;
		}

		target = Object.getPrototypeOf(target);
	}

	return options;
}
