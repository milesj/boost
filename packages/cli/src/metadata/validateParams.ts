import { ParamConfigList } from '@boost/args';
import { optimal } from '@boost/common/optimal';
import { msg } from '../translate';
import { paramBlueprint } from './blueprints';

export function validateParams(params: ParamConfigList) {
	params.forEach((config, index) =>
		optimal(paramBlueprint, {
			name: msg('cli:labelParam', { name: config.label ?? index }),
			unknown: false,
		}).validate(config),
	);
}
