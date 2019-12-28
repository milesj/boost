import 'reflect-metadata';
import { ParamConfig } from '@boost/args';
import { optimal } from '@boost/common';
import { paramBlueprint } from './blueprints';
import { META_PARAMS } from '../constants';
import { CommandMetadata } from '../types';

export default function registerParams<T extends Object>(
  target: T,
  method: keyof T,
  config: ParamConfig[],
) {
  if (method !== 'run') {
    throw new Error('Parameters must be registered on the `run()` method.');
  }

  const metadata: CommandMetadata['params'] = config.map((cfg, index) =>
    optimal(cfg, paramBlueprint, {
      name: `Param "${cfg.label || index}"`,
      unknown: false,
    }),
  );

  Reflect.defineMetadata(META_PARAMS, metadata, target);
}
