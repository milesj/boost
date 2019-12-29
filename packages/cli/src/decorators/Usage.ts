import 'reflect-metadata';
import { Command as CommandConfig } from '@boost/args';
import { optimal } from '@boost/common';
import { commandBlueprint } from '../metadata/blueprints';
import { META_CONFIG, META_PATH } from '../constants';
import { PartialConfig, CommandConstructorMetadata } from '../types';

export default function Usage(
  path: string,
  description: string,
  config: PartialConfig<CommandConfig> = {},
) {
  // Class
  return (target: Object) => {
    const meta = optimal(
      {
        ...config,
        description,
        path,
      },
      commandBlueprint,
      {
        name: path,
        unknown: false,
      },
    );

    Reflect.defineMetadata(META_PATH, meta.path, target);
    Reflect.defineMetadata(META_CONFIG, meta, target);

    // Also update static properties on constructor
    const ctor = target as CommandConstructorMetadata;

    ctor.description = meta.description;
    ctor.deprecated = meta.deprecated;
    ctor.hidden = meta.hidden;
    ctor.path = meta.path;
    ctor.usage = meta.usage;
  };
}
