/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import chalk from 'chalk';
import path from 'path';
import upperFirst from 'lodash/upperFirst';
import formatModuleName from './helpers/formatModuleName';
import isObject from './helpers/isObject';
import requireModule from './helpers/requireModule';
import instanceOf from './helpers/instanceOf';
import Tool from './Tool';
import { Constructor, Debugger } from './types';

export type OptionsObject = { [key: string]: any };

export default class ModuleLoader<Tm> {
  contract: Constructor<Tm> | null = null;

  debug: Debugger;

  scopes: string[];

  tool: Tool<any>;

  typeName: string;

  constructor(
    tool: Tool<any>,
    typeName: string,
    contract: Constructor<Tm> | null = null,
    scopes: string[] = [],
  ) {
    this.contract = contract;
    this.debug = tool.createDebugger(`${typeName}-loader`);
    this.scopes = scopes;
    this.tool = tool;
    this.typeName = typeName;
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

      // Additional scopes to load
      this.scopes.forEach(otherScope => {
        modulesToAttempt.push(
          formatModuleName(otherScope, typeName, name, true),
          formatModuleName(otherScope, typeName, name),
        );
      });

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
    if (instanceOf(importedModule, this.contract)) {
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

    if (!instanceOf(module, this.contract)) {
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
    if (this.contract && instanceOf(module, this.contract)) {
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
