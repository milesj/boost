import 'reflect-metadata';
import { Command as CommandConfig } from '@boost/args';
import { META_CONFIG, META_PATH } from '../constants';
import { PartialConfig, CommandConstructorMetadata } from '../types';

export default function Meta(
  path: string,
  description: string,
  config: PartialConfig<CommandConfig> = {},
) {
  // Class
  return (target: Object) => {
    Reflect.defineMetadata(META_PATH, path, target);
    Reflect.defineMetadata(
      META_CONFIG,
      {
        ...config,
        description,
      },
      target,
    );

    // Also update static properties on constructor
    const ctor = target as CommandConstructorMetadata;

    ctor.description = description;
    ctor.deprecated = config.deprecated ?? false;
    ctor.hidden = config.hidden ?? false;
    ctor.path = path;
    ctor.usage = config.usage ?? '';
  };
}
