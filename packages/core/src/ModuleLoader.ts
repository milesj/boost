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
import Module from './Module';
import Tool from './Tool';
import { Debugger } from './types';

export type Constructor<T> = new (...args: any[]) => T;

export type OptionsObject = { [key: string]: any };

export default class ModuleLoader<Tm extends Module<any>> {
  classReference: Constructor<Tm>;

  debug: Debugger;

  loadBoostModules: boolean;

  tool: Tool;

  typeName: string;

  constructor(
    tool: Tool,
    typeName: string,
    classReference: Constructor<Tm>,
    loadBoostModules: boolean = false,
  ) {
    this.classReference = classReference;
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
        `Missing ${typeName}. Attempted import in order: ${modulesToAttempt.join(', ')}`,
      );
    }

    // An instance was returned instead of the class definition
    if (importedModule instanceof this.classReference) {
      throw new TypeError(
        `A ${typeName} class instance was exported from "${moduleName}". ` +
          `${upperFirst(appName)} requires a ${typeName} class definition to be exported.`,
      );
    } else if (typeof importedModule !== 'function') {
      throw new TypeError(`Invalid ${typeName} class definition exported from "${moduleName}".`);
    }

    const ModuleClass = importedModule as Constructor<Tm>;
    const module = new ModuleClass(...args);

    if (!(module instanceof this.classReference)) {
      throw new TypeError(`${upperFirst(typeName)} exported from "${moduleName}" is invalid.`);
    }

    if (isFilePath) {
      this.debug('Found with file path %s', chalk.cyan(moduleName));
    } else {
      this.debug('Found with module %s', chalk.yellow(moduleName));

      module.name = name;
      module.moduleName = moduleName;
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
      throw new TypeError(
        `A "${typeName}" property must exist when loading through an options object.`,
      );
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
    if (module instanceof this.classReference) {
      return module;
    } else if (typeof module === 'string') {
      return this.importModule(module, args);
    } else if (isObject(module)) {
      return this.importModuleFromOptions(module, args);
    }

    throw new TypeError(
      `Invalid ${
        this.typeName
      }. Must be a class instance or a module that exports a class definition.`,
    );
  }

  /**
   * Load multiple modules.
   */
  loadModules(modules: (string | OptionsObject | Tm)[] = [], args: any[] = []): Tm[] {
    return modules.map(module => this.loadModule(module, args));
  }
}
