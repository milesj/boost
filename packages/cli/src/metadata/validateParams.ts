import { ParamConfigList } from '@boost/args';
import { optimal } from '@boost/common';
import { msg } from '../translate';
import { paramBlueprint } from './blueprints';

export function validateParams(params: ParamConfigList) {
	params.forEach((config, index) =>
		optimal(config, paramBlueprint, {
			name: msg('cli:labelParam', { name: config.label ?? index }),
			unknown: false,
		}),
	);
}
