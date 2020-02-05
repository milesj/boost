import 'reflect-metadata';
import { optimal } from '@boost/common';
import { commandConstructorBlueprint } from '../metadata/blueprints';
import { META_CONFIG, META_PATH } from '../constants';
import { PartialConfig, CommandStaticMetadata } from '../types';

export default function Config(
  path: string,
  description: string,
  config?: Partial<PartialConfig<CommandStaticMetadata>>,
) {
  // Class
  return (target: Object) => {
    const meta = optimal(
      {
        ...config,
        description,
        path,
      },
      commandConstructorBlueprint,
      {
        name: path,
        unknown: false,
      },
    );

    Reflect.defineMetadata(META_PATH, meta.path, target);
    Reflect.defineMetadata(META_CONFIG, meta, target);

    // Also update static properties on constructor
    const ctor = target as CommandStaticMetadata;

    ctor.description = meta.description;
    ctor.deprecated = meta.deprecated;
    ctor.hidden = meta.hidden;
    ctor.path = meta.path;
    ctor.usage = meta.usage;
  };
}
