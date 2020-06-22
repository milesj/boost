import { optimal } from '@boost/common';
import { ParamConfigList } from '@boost/args';
import { paramBlueprint } from './blueprints';
import msg from '../translate';

export default function validateParams(params: ParamConfigList) {
  params.forEach((config, index) =>
    optimal(config, paramBlueprint, {
      name: msg('cli:labelParam', { name: config.label || index }),
      unknown: false,
    }),
  );
}
