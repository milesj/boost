import { optimal } from '@boost/common';
import { ParamConfigList } from '@boost/args';
import { paramBlueprint } from './blueprints';

export default function validateParams(params: ParamConfigList) {
  params.forEach((config, index) =>
    optimal(config, paramBlueprint, {
      name: `Param "${config.label || index}"`,
      unknown: false,
    }),
  );
}
