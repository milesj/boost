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

    if (config.allowUnknownOptions !== undefined) {
      ctor.allowUnknownOptions = config.allowUnknownOptions;
    }

    if (config.categories !== undefined) {
      ctor.categories = config.categories;
    }

    if (config.category !== undefined) {
      ctor.category = config.category;
    }

    if (config.deprecated !== undefined) {
      ctor.deprecated = config.deprecated;
    }

    if (config.hidden !== undefined) {
      ctor.hidden = config.hidden;
    }

    if (config.showRestParams !== undefined) {
      ctor.showRestParams = config.showRestParams;
    }

    if (config.usage !== undefined) {
      ctor.usage = config.usage;
    }
  };
}
