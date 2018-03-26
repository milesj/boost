/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import path from 'path';
import upperFirst from 'lodash/upperFirst';
import { Struct } from 'optimal';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import requireModule from './helpers/requireModule';
import { ModuleInterface } from './Module';
import { ToolInterface } from './Tool';

export type Constructor<T> = new (...args: any[]) => T;

export default class ModuleLoader<Tm extends ModuleInterface> {
  classReference: Constructor<Tm>;

  debug: debug.IDebugger;

  tool: ToolInterface;

  typeName: string;

  constructor(tool: ToolInterface, typeName: string, classReference: Constructor<Tm>) {
    this.classReference = classReference;
    this.debug = tool.createDebugger(`${typeName}-loader`);
    this.tool = tool;
    this.typeName = typeName;

    this.debug('Using alias %s', chalk.green(typeName));
  }

  /**
   * Import a class definition from a Node module and instantiate the class
   * with the provided options object.
   */
  importModule(name: string, options: Struct = {}): Tm {
    const { typeName } = this;
    const { appName, scoped } = this.tool.options;

    // Determine modules to attempt to load
    const modulesToAttempt = [];
    let isFilePath = false;
    let importedModule: any = null;
    let moduleName;

    // File path
    if (name.match(/^\.|\/|\\|[A-Z]:/)) {
      this.debug('Locating %s from path %s', typeName, chalk.cyan(name));

      modulesToAttempt.push(path.normalize(name));
      isFilePath = true;

      // Module name
    } else {
      this.debug('Locating %s module %s', typeName, chalk.yellow(name));

      modulesToAttempt.push(formatModuleName(appName, typeName, name, false));

      if (scoped) {
        modulesToAttempt.unshift(formatModuleName(appName, typeName, name, true));
      }

      this.debug('Resolving in order: %s', modulesToAttempt.join(', '));
    }

    modulesToAttempt.some(modName => {
      try {
        importedModule = requireModule(modName);
        moduleName = modName;

        return true;
      } catch (error) {
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
    const module = new ModuleClass(options);

    if (!(module instanceof this.classReference)) {
      throw new TypeError(`${upperFirst(typeName)} exported from "${moduleName}" is invalid.`);
    }

    if (isFilePath) {
      this.debug('Found with %s', chalk.cyan(moduleName));
    } else {
      this.debug('Found with %s', chalk.yellow(moduleName));

      module.name = name;
      module.moduleName = moduleName;
    }

    return module;
  }

  /**
   * If loading from an object, extract the module name and use the remaining object
   * as options for the class instance.
   */
  importModuleFromOptions(baseOptions: Struct): Tm {
    const { typeName } = this;
    const options = { ...baseOptions };
    const module = options[typeName];

    delete options[typeName];

    if (!module || typeof module !== 'string') {
      throw new TypeError(
        `A "${typeName}" property must exist when loading through an options object.`,
      );
    }

    return this.importModule(module, options);
  }

  /**
   * Load and or instantiate a module for the `typeName` configuration property.
   * If a class instance, use directly. If a string, attempt to load and
   * instantiate from a module. If an object, extract the name and run the previous.
   */
  loadModule(module: string | Struct | Tm): Tm {
    if (module instanceof this.classReference) {
      return module;
    } else if (typeof module === 'string') {
      return this.importModule(module);
    } else if (isObject(module)) {
      return this.importModuleFromOptions(module);
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
  loadModules(modules: (string | Struct | Tm)[] = []): Tm[] {
    return modules.map(module => this.loadModule(module));
  }
}
