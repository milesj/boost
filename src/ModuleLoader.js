/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types */

import upperFirst from 'lodash/upperFirst';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import requireModule from './helpers/requireModule';

import type { ToolOptions } from './types';

export default class ModuleLoader<Tm> {
  classReference: Function;

  options: ToolOptions;

  typeName: string;

  constructor(typeName: string, classReference: Function, options: ToolOptions) {
    this.classReference = classReference;
    this.options = options;
    this.typeName = typeName;
  }

  /**
   * Import a class definition from a Node module and instantiate the class
   * with the provided options object.
   */
  importModule(name: string, options?: Object = {}): Tm {
    const { typeName } = this;
    const { appName, scoped } = this.options;
    const moduleName = formatModuleName(appName, typeName, name, scoped);
    let importedModule;

    try {
      importedModule = requireModule(moduleName);
    } catch (error) {
      throw new Error(`Missing ${typeName} module "${moduleName}".`);
    }

    // An instance was returned instead of the class definition
    if (importedModule instanceof this.classReference) {
      throw new TypeError(
        `A ${typeName} class instance was exported from "${moduleName}". ` +
        `${upperFirst(appName)} requires a ${typeName} class definition to be exported.`,
      );

    } else if (typeof importedModule !== 'function') {
      throw new TypeError(
        `Invalid ${typeName} class definition exported from "${moduleName}".`,
      );
    }

    const ModuleClass = importedModule;
    const module = new ModuleClass(options);

    if (!(module instanceof this.classReference)) {
      throw new TypeError(`${upperFirst(typeName)} exported from "${moduleName}" is invalid.`);
    }

    module.name = name;
    module.moduleName = moduleName;

    return module;
  }

  /**
   * If loading from an object, extract the module name and use the remaining object
   * as options for the class instance.
   */
  importModuleFromOptions(baseOptions: Object): Tm {
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
  loadModule(module: string | Object | Tm): Tm {
    if (module instanceof this.classReference) {
      return module;

    } else if (typeof module === 'string') {
      return this.importModule(module);

    } else if (isObject(module)) {
      // $FlowIgnore Temporarily
      return this.importModuleFromOptions(module);
    }

    throw new TypeError(
      `Invalid ${this.typeName}. Must be a class instance or a module that exports a class definition.`,
    );
  }

  /**
   * Load multiple modules.
   */
  loadModules(modules: (string | Object | Tm)[] = []): Tm[] {
    return modules.map(module => this.loadModule(module));
  }
}
