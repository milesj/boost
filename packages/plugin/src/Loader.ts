import path from 'path';
import { Path, requireModule } from '@boost/common';
import { color, createDebugger, Debugger } from '@boost/debug';
import { Lookup, LookupType, PluginType } from './types';
import formatModuleName from './formatModuleName';

export default class Loader<Plugin> {
  debug: Debugger;

  lookups: Lookup[] = [];

  pluginType: PluginType<Plugin>;

  constructor(pluginType: PluginType<Plugin>) {
    this.pluginType = pluginType;
    this.debug = createDebugger(`${pluginType.singularName}-loader`);
  }

  addFilePathLookup(filePath: Path): this {
    if (!path.isAbsolute(filePath)) {
      throw new Error('File path to use as a lookup must be absolute.');
    }

    this.lookups.push({
      path: path.normalize(path.resolve(filePath)),
      type: LookupType.FILE_PATH,
    });

    return this;
  }

  addPackageLookup(appName: string, moduleName: string, scoped: boolean = false): this {
    if (scoped) {
      this.lookups.push({
        name: formatModuleName(appName, this.pluginType.singularName, moduleName, true),
        type: LookupType.NODE_MODULE,
      });
    }

    this.lookups.push({
      name: formatModuleName(appName, this.pluginType.singularName, moduleName),
      type: LookupType.NODE_MODULE,
    });

    return this;
  }

  load(): Plugin {
    const { pluginType } = this;
    const loadAttempts: string[] = [];
    let importedModule: Plugin | null = null;
    let source: string = '';

    this.lookups.some(lookup => {
      try {
        switch (lookup.type) {
          case LookupType.FILE_PATH:
            this.debug(
              'Looking for %s in path: %s',
              pluginType.singularName,
              color.cyan(lookup.path),
            );

            importedModule = requireModule(lookup.path);
            source = lookup.path;
            loadAttempts.push(lookup.path);

            break;

          case LookupType.NODE_MODULE:
            this.debug(
              'Looking for %s in package: %s',
              pluginType.singularName,
              color.yellow(lookup.name),
            );
            importedModule = requireModule(lookup.name);
            source = lookup.name;
            loadAttempts.push(lookup.name);

            break;

          default:
            throw new Error('Unknown lookup type. How did you get here?');
        }

        return true;
      } catch (error) {
        return false;
      }
    });
  }

  validateDeclarationInstance() {}

  validatePluggableShape() {}
}
