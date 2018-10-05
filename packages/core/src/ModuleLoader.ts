/**
 * @copyright   2017-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import path from 'path';
import upperFirst from 'lodash/upperFirst';
import pluralize from 'pluralize';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import requireModule from './helpers/requireModule';
import Tool from './Tool';
import { Debugger } from './types';

export type Constructor<T> = new (...args: any[]) => T;

export type OptionsObject = { [key: string]: any };

export default class ModuleLoader<Tm> {
  contract: Constructor<Tm> | null = null;

  debug: Debugger;

  loadBoostModules: boolean;

  tool: Tool;

  typeName: string;

  constructor(
    tool: Tool,
    typeName: string,
    contract: Constructor<Tm> | null = null,
    loadBoostModules: boolean = false,
  ) {
    this.contract = contract;
    this.debug = tool.createDebugger(`${typeName}-loader`);
    this.loadBoostModules = loadBoostModules;
    this.tool = tool;
    this.typeName = typeName;

    this.debug('Loading %s', chalk.green(pluralize(typeName)));
  }

  /**
   * Import a class definition from a Node module and instantiate the class
   * with the provided options object.
   */
  importModule(name: string, args: any[] = []): Tm {
    const { typeName } = this;
    const { appName, scoped } = this.tool.options;

    // Determine modules to attempt to load
    const modulesToAttempt = [];
    let isFilePath = false;
    let importedModule: any = null;
    let moduleName;

    // File path
    if (name.match(/^\.|\/|\\|[A-Z]:/u)) {
      this.debug('Locating %s from path %s', typeName, chalk.cyan(name));

      modulesToAttempt.push(path.normalize(name));
      isFilePath = true;

      // Module name
    } else {
      this.debug('Locating %s module %s', typeName, chalk.yellow(name));

      if (scoped) {
        modulesToAttempt.push(formatModuleName(appName, typeName, name, true));
      }

      modulesToAttempt.push(formatModuleName(appName, typeName, name));

      if (this.loadBoostModules) {
        modulesToAttempt.push(
          formatModuleName('boost', typeName, name, true),
          formatModuleName('boost', typeName, name),
        );
      }

      this.debug('Resolving in order: %s', modulesToAttempt.join(', '));
    }

    modulesToAttempt.some(modName => {
      try {
        importedModule = requireModule(modName);
        moduleName = modName;

        return true;
      } catch (error) {
        this.debug('Failed to import module: %s', error.message);

        return false;
      }
    });

    if (!importedModule || !moduleName) {
      throw new Error(
        this.tool.msg('errors:moduleImportFailed', {
          modules: modulesToAttempt.join(', '),
          typeName,
        }),
      );
    }

    if (!this.contract) {
      return importedModule;
    }

    // An instance was returned instead of the class definition
    if (importedModule instanceof this.contract) {
      throw new TypeError(
        this.tool.msg('errors:moduleClassInstanceExported', {
          appName: upperFirst(appName),
          moduleName,
          typeName,
        }),
      );
    } else if (typeof importedModule !== 'function') {
      throw new TypeError(this.tool.msg('errors:moduleClassDefRequired', { moduleName, typeName }));
    }

    const ModuleClass = importedModule as Constructor<Tm>;
    const module = new ModuleClass(...args);

    if (!(module instanceof this.contract)) {
      throw new TypeError(
        this.tool.msg('errors:moduleExportInvalid', {
          moduleName,
          typeName: upperFirst(typeName),
        }),
      );
    }

    if (isFilePath) {
      this.debug('Found with file path %s', chalk.cyan(moduleName));
    } else {
      this.debug('Found with module %s', chalk.yellow(moduleName));

      (module as any).name = name;
      (module as any).moduleName = moduleName;
    }

    return module;
  }

  /**
   * If loading from an object, extract the module name and use the remaining object
   * as options for the class instance.
   */
  importModuleFromOptions(baseOptions: OptionsObject, args: any[] = []): Tm {
    const { typeName } = this;
    const options = { ...baseOptions };
    const module = options[typeName];

    delete options[typeName];

    if (!module || typeof module !== 'string') {
      throw new TypeError(this.tool.msg('errors:moduleOptionMissingKey', { typeName }));
    }

    const nextArgs = [...args];

    if (nextArgs.length === 0) {
      nextArgs.push(options);
    } else if (isObject(nextArgs[0])) {
      nextArgs[0] = {
        ...nextArgs[0],
        ...options,
      };
    }

    return this.importModule(module, nextArgs);
  }

  /**
   * Load and or instantiate a module for the `typeName` configuration property.
   * If a class instance, use directly. If a string, attempt to load and
   * instantiate from a module. If an object, extract the name and run the previous.
   */
  loadModule(module: string | OptionsObject | Tm, args: any[] = []): Tm {
    if (this.contract && module instanceof this.contract) {
      return module;
    } else if (typeof module === 'string') {
      return this.importModule(module, args);
    } else if (isObject(module)) {
      return this.importModuleFromOptions(module, args);
    }

    throw new TypeError(this.tool.msg('errors:moduleTypeInvalid', { typeName: this.typeName }));
  }

  /**
   * Load multiple modules.
   */
  loadModules(modules: (string | OptionsObject | Tm)[] = [], args: any[] = []): Tm[] {
    return modules.map(module => this.loadModule(module, args));
  }
}
