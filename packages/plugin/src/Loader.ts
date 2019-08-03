import path from 'path';
import { requireModule, Path } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { Lookup, LookupType, PluginType } from './types';
import formatModuleName from './formatModuleName';

export default class Loader<Plugin> {
  readonly debug: Debugger;

  readonly lookups: Lookup[] = [];

  readonly type: PluginType<Plugin>;

  constructor(type: PluginType<Plugin>) {
    this.type = type;
    this.debug = createDebugger(`${type.singularName}-loader`);
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

  addPackageLookup(toolName: string, moduleName: string, scoped: boolean = false): this {
    if (scoped) {
      this.lookups.push({
        name: formatModuleName(toolName, this.type.singularName, moduleName, true),
        type: LookupType.NODE_MODULE,
      });
    }

    this.lookups.push({
      name: formatModuleName(toolName, this.type.singularName, moduleName),
      type: LookupType.NODE_MODULE,
    });

    return this;
  }

  load() {
    const { type } = this;
    const loadAttempts: string[] = [];
    let importedModule: Plugin | null = null;
    let source: string = '';

    this.lookups.some(lookup => {
      try {
        switch (lookup.type) {
          case LookupType.FILE_PATH:
            this.debug('Looking for %s in path: %s', type.singularName, lookup.path);

            importedModule = requireModule(lookup.path);
            source = lookup.path;
            loadAttempts.push(lookup.path);

            break;

          case LookupType.NODE_MODULE:
            this.debug('Looking for %s in package: %s', type.singularName, lookup.name);
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
}
