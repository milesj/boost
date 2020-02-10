import { optimal } from '@boost/common';
import { ParamConfigList } from '@boost/args';
import { paramBlueprint } from './blueprints';

export default function validateParams<T extends ParamConfigList>(params: T): T {
  return params.map((config, index) =>
    optimal(config, paramBlueprint, {
      name: `Param "${config.label || index}"`,
      unknown: false,
    }),
  ) as T;
}
