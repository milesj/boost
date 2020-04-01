import { PartialConfig, CommandStaticConfig } from '../types';

export default function Config(
  path: string,
  description: string,
  config: Partial<PartialConfig<CommandStaticConfig>> = {},
): ClassDecorator {
  return target => {
    const ctor = (target as unknown) as CommandStaticConfig;

    ctor.path = path;
    ctor.description = description;

    if (config.aliases !== undefined) {
      ctor.aliases = config.aliases;
    }

    if (config.usage !== undefined) {
      ctor.usage = config.usage;
    }

    if (config.deprecated !== undefined) {
      ctor.deprecated = config.deprecated;
    }

    if (config.hidden !== undefined) {
      ctor.hidden = config.hidden;
    }

    if (config.allowUnknownOptions !== undefined) {
      ctor.allowUnknownOptions = config.allowUnknownOptions;
    }
  };
}
