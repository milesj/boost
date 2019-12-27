import 'reflect-metadata';
import { RuntimeError } from '@boost/internal';
import { COMMAND_FORMAT, Command as CommandConfig } from '@boost/args';
import { META_CONFIG, META_PATH } from '../constants';
import { PartialConfig, CommandConstructorMetadata } from '../types';

export default function Meta(
  path: string,
  description: string,
  config: PartialConfig<CommandConfig> = {},
) {
  // Class
  return (target: Object) => {
    if (!path.match(COMMAND_FORMAT)) {
      throw new RuntimeError('args', 'AG_COMMAND_INVALID_FORMAT', [name]);
    }

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
