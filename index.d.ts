declare module 'boost/lib/helpers/formatModuleName' {
  export default function formatModuleName(appName: string, addonName: string, name: string, scoped?: boolean): string;

}
declare module 'boost/lib/helpers/isObject' {
  export default function isObject(value: any): boolean;

}
declare module 'boost/lib/helpers/isEmptyObject' {
  export default function isEmptyObject(value: any): boolean;

}
declare module 'boost/lib/helpers/requireModule' {
  export default function requireModule<T>(path: string): T;

}
declare module 'boost/lib/constants' {
  import { Status, ToolConfig } from 'boost/lib/types';
  export const APP_NAME_PATTERN: RegExp;
  export const MODULE_NAME_PATTERN: RegExp;
  export const PLUGIN_NAME_PATTERN: RegExp;
  export const STATUS_PENDING: Status;
  export const STATUS_RUNNING: Status;
  export const STATUS_SKIPPED: Status;
  export const STATUS_PASSED: Status;
  export const STATUS_FAILED: Status;
  export const DEFAULT_TOOL_CONFIG: ToolConfig;

}
declare module 'boost/lib/Task' {
  import { Options } from 'optimal';
  import { Context, Status, Partial } from 'boost/lib/types';
  export interface TaskInterface {
      status: Status;
      statusText: string;
      subroutines: TaskInterface[];
      subtasks: TaskInterface[];
      title: string;
      isPending(): boolean;
      isRunning(): boolean;
      isSkipped(): boolean;
      hasFailed(): boolean;
      hasPassed(): boolean;
      run<T>(context: any, initialValue?: T | null): Promise<T | null>;
      spinner(): string;
  }
  export type TaskAction<Tx extends Context> = (context: Tx, value: any) => any | Promise<any>;
  export default class Task<To extends Options, Tx extends Context> implements TaskInterface {
      action: TaskAction<Tx> | null;
      context: Tx;
      frame: number;
      options: To;
      title: string;
      status: Status;
      statusText: string;
      subroutines: TaskInterface[];
      subtasks: TaskInterface[];
      constructor(title: string, action?: TaskAction<Tx> | null, options?: Partial<To>);
      hasFailed(): boolean;
      hasPassed(): boolean;
      isPending(): boolean;
      isRunning(): boolean;
      isSkipped(): boolean;
      run<T>(context: Tx, initialValue?: T | null): Promise<T | null>;
      skip(condition?: boolean): this;
      spinner(): string;
      wrap<T>(value: T | Promise<T>): Promise<T>;
  }

}
declare module 'boost/lib/types' {
  import { Blueprint, Options } from 'optimal';
  import { TaskInterface } from 'boost/lib/Task';
  export type Partial<T> = {
      [P in keyof T]?: T[P];
  };
  export interface Context {
      [key: string]: any;
  }
  export interface Config {
      [key: string]: any;
  }
  export interface ConsoleOptions extends Options {
      footer: string;
      header: string;
      silent: boolean;
  }
  export interface ToolConfig extends Config {
      debug: boolean;
      extends: string | string[];
      plugins: string[];
      reporter: string;
      silent: boolean;
      [key: string]: any;
  }
  export interface ToolOptions extends Options {
      appName: string;
      configBlueprint: Blueprint;
      configFolder: string;
      extendArgv: string;
      footer: string;
      header: string;
      pluginAlias: string;
      root: string;
      scoped: boolean;
  }
  export interface PackageConfig extends Config {
      name: string;
  }
  export interface ReportParams {
      errors: string[];
      footer: string;
      header: string;
      logs: string[];
      silent: boolean;
      tasks: TaskInterface[];
  }
  export type ReportLoader = () => ReportParams;
  export type Status = 'pending' | 'running' | 'skipped' | 'passed' | 'failed';
  export type EventArguments = any[];
  export type EventListener = (...args: EventArguments) => void;
  export type EventNextHandler = (index: number, ...args: EventArguments) => void;

}
declare module 'boost/lib/Event' {
  import { EventNextHandler } from 'boost/lib/types';
  export default class Event {
      name: string;
      next: EventNextHandler | null;
      stopped: boolean;
      time: number;
      value: any;
      constructor(name: string, value?: any);
      stop(): void;
  }

}
declare module 'boost/lib/Emitter' {
  import Event from 'boost/lib/Event';
  import { EventArguments, EventListener } from 'boost/lib/types';
  export interface EmitterInterface {
      emit(name: string, args: EventArguments, initialValue: any): Event;
      off(eventName: string, listener: EventListener): this;
      on(eventName: string, listener: EventListener): this;
  }
  export default class Emitter implements EmitterInterface {
      listeners: {
          [eventName: string]: Set<EventListener>;
      };
      namespace: string;
      createEventName(name: string): string;
      emit(name: string, args?: EventArguments, initialValue?: any): Event;
      emitCascade(name: string, args?: EventArguments, initialValue?: any): Event;
      getEventNames(): string[];
      getListeners(eventName: string): Set<EventListener>;
      off(eventName: string, listener: EventListener): this;
      on(eventName: string, listener: EventListener): this;
      setEventNamespace(namespace: string): this;
      removeEventNamespace(): this;
  }

}
declare module 'boost/lib/ExitError' {
  export default class ExitError extends Error {
      code: number;
      constructor(message: string, code?: number);
  }

}
declare module 'boost/lib/Module' {
  import { Options } from 'optimal';
  import { Partial } from 'boost/lib/types';
  export interface ModuleInterface {
      moduleName: string;
      name: string;
  }
  export default class Module<To extends Options> implements ModuleInterface {
      moduleName: string;
      name: string;
      options: To;
      constructor(options?: Partial<To>);
  }

}
declare module 'boost/lib/Reporter' {
  /// <reference types="node" />
  import { Options } from 'optimal';
  import Module, { ModuleInterface } from 'boost/lib/Module';
  import { TaskInterface } from 'boost/lib/Task';
  import { ReportLoader } from 'boost/lib/types';
  export const REFRESH_RATE: number;
  export const CURSOR: string;
  export interface ReporterInterface extends ModuleInterface {
      render(code: number): string;
      start(loader: ReportLoader): this;
      stop(): this;
      update(): this;
  }
  export default class Reporter<To extends Options> extends Module<To> implements ReporterInterface {
      instance?: NodeJS.Timer;
      loader: ReportLoader | null;
      indent(length: number): string;
      render(code?: number): string;
      renderMessage(message: string): string;
      renderTask(task: TaskInterface, level?: number, suffix?: string): string[];
      renderStatus(task: TaskInterface): string;
      start(loader: ReportLoader): this;
      stop(): this;
      update(): this;
  }

}
declare module 'boost/lib/Console' {
  import Emitter, { EmitterInterface } from 'boost/lib/Emitter';
  import { TaskInterface } from 'boost/lib/Task';
  import { ReporterInterface } from 'boost/lib/Reporter';
  import { ConsoleOptions, Partial } from 'boost/lib/types';
  export interface ConsoleInterface extends EmitterInterface {
      options: ConsoleOptions;
      reporter: ReporterInterface;
      error(message: string): void;
      exit(message: string | Error | null, code: number): void;
      log(message: string): void;
      start(tasks: TaskInterface[]): void;
      update(): void;
  }
  export const DEBUG_COLORS: string[];
  export default class Console<Tr extends ReporterInterface> extends Emitter implements ConsoleInterface {
      errors: string[];
      interrupted: boolean;
      logs: string[];
      options: ConsoleOptions;
      reporter: Tr;
      constructor(reporter: Tr, options?: Partial<ConsoleOptions>);
      error(message: string): void;
      exit(message: string | Error | null, code?: number): void;
      log(message: string): void;
      start(tasks?: TaskInterface[]): void;
      stop(): void;
      update(): void;
  }

}
declare module 'boost/lib/ModuleLoader' {
  /// <reference types="debug" />
  import { Options } from 'optimal';
  import { ModuleInterface } from 'boost/lib/Module';
  import { ToolInterface } from 'boost/lib/Tool';
  export type Constructor<T> = new (...args: any[]) => T;
  export default class ModuleLoader<Tm extends ModuleInterface> {
      classReference: Constructor<Tm>;
      debug: debug.IDebugger;
      tool: ToolInterface;
      typeName: string;
      constructor(tool: ToolInterface, typeName: string, classReference: Constructor<Tm>);
      importModule(name: string, options?: Options): Tm;
      importModuleFromOptions(baseOptions: Options): Tm;
      loadModule(module: string | Options | Tm): Tm;
      loadModules(modules?: (string | Options | Tm)[]): Tm[];
  }

}
declare module 'boost/lib/Plugin' {
  import { Options } from 'optimal';
  import Module, { ModuleInterface } from 'boost/lib/Module';
  import { ToolInterface } from 'boost/lib/Tool';
  export const DEFAULT_PLUGIN_PRIORITY: number;
  export interface PluginInterface extends ModuleInterface {
      priority: number;
      tool: ToolInterface;
      bootstrap(): void;
  }
  export default class Plugin<To extends Options> extends Module<To> implements PluginInterface {
      priority: number;
      tool: ToolInterface;
      bootstrap(): void;
  }

}
declare module 'boost/lib/helpers/enableDebug' {
  export default function enableDebug(namespace: string): void;

}
declare module 'boost/lib/Tool' {
  /// <reference types="debug" />
  import debug from 'debug';
  import ConfigLoader from 'boost/lib/ConfigLoader';
  import { ConsoleInterface } from 'boost/lib/Console';
  import Emitter, { EmitterInterface } from 'boost/lib/Emitter';
  import ModuleLoader from 'boost/lib/ModuleLoader';
  import { PluginInterface } from 'boost/lib/Plugin';
  import { ReporterInterface } from 'boost/lib/Reporter';
  import { ToolConfig, ToolOptions, PackageConfig, Partial } from 'boost/lib/types';
  export interface ToolInterface extends EmitterInterface {
      argv: string[];
      config: ToolConfig;
      console: ConsoleInterface;
      debug: debug.IDebugger;
      options: ToolOptions;
      package: PackageConfig;
      plugins: PluginInterface[];
      createDebugger(...namespaces: string[]): debug.IDebugger;
  }
  export default class Tool<Tp extends PluginInterface, Tr extends ReporterInterface> extends Emitter implements ToolInterface {
      argv: string[];
      config: ToolConfig;
      configLoader: ConfigLoader;
      console: ConsoleInterface;
      debug: debug.IDebugger;
      initialized: boolean;
      options: ToolOptions;
      package: PackageConfig;
      pluginLoader: ModuleLoader<Tp>;
      plugins: Tp[];
      constructor({footer, header, ...options}: Partial<ToolOptions>, argv?: string[]);
      createDebugger(...namespaces: string[]): debug.IDebugger;
      exit(message: string | Error | null, code?: number): this;
      getPlugin(name: string): Tp;
      initialize(): this;
      invariant(condition: boolean, message: string, pass: string, fail: string): this;
      loadConfig(): this;
      loadPlugins(): this;
      loadReporter(): this;
      log(message: string): this;
      logError(message: string): this;
  }

}
declare module 'boost/lib/ConfigLoader' {
  /// <reference types="debug" />
  import { Options } from 'optimal';
  import { ToolInterface } from 'boost/lib/Tool';
  import { Config, ToolConfig, PackageConfig } from 'boost/lib/types';
  export default class ConfigLoader {
      debug: debug.IDebugger;
      package: PackageConfig;
      parsedFiles: {
          [path: string]: boolean;
      };
      tool: ToolInterface;
      constructor(tool: ToolInterface);
      handleMerge(target: any, source: any): any;
      loadConfig(): ToolConfig;
      loadPackageJSON(): PackageConfig;
      parseAndExtend(fileOrConfig: string | Config): Config;
      parseFile(filePath: string, options?: Options): Config;
      resolveExtendPaths(extendPaths: string[], baseDir?: string): string[];
      resolveModuleConfigPath(appName: string, moduleName: string, preset?: boolean, ext?: string): string;
  }

}
declare module 'boost/lib/Routine' {
  /// <reference types="debug" />
  /// <reference types="execa" />
  import debug from 'debug';
  import { Options as ExecaOptions, SyncOptions as ExecaSyncOptions, ExecaChildProcess, ExecaReturns } from 'execa';
  import { Options } from 'optimal';
  import Task, { TaskAction, TaskInterface } from 'boost/lib/Task';
  import { ToolInterface } from 'boost/lib/Tool';
  import { Context, Partial } from 'boost/lib/types';
  export interface CommandOptions {
      sync?: boolean;
  }
  export default class Routine<To extends Options, Tx extends Context> extends Task<To, Tx> {
      exit: boolean;
      debug: debug.IDebugger;
      key: string;
      tool: ToolInterface;
      constructor(key: string, title: string, options?: Partial<To>);
      bootstrap(): void;
      configure(parent: Routine<Options, Tx>): this;
      execute<T>(context: Tx, value?: T | null): Promise<T | null>;
      executeCommand(command: string, args: string[], options?: (ExecaOptions | ExecaSyncOptions) & CommandOptions, callback?: ((process: ExecaChildProcess) => void) | null): Promise<ExecaReturns>;
      executeTask<T>(task: TaskInterface, value?: T | null): Promise<T | null>;
      parallelizeSubroutines<T>(value?: T | null): Promise<(T | null)[]>;
      parallelizeTasks<T>(value?: T | null): Promise<(T | null)[]>;
      pipe(routine: TaskInterface): this;
      run<T>(context: Tx, value?: T | null): Promise<T | null>;
      serialize<T>(tasks: TaskInterface[], initialValue: T | null | undefined, accumulator: (task: TaskInterface, value: T | null) => Promise<T | null>): Promise<T | null>;
      serializeSubroutines<T>(value?: T | null): Promise<T | null>;
      serializeTasks<T>(value?: T | null): Promise<T | null>;
      task(title: string, action: TaskAction<Tx>, options?: Options): TaskInterface;
  }

}
declare module 'boost/lib/Pipeline' {
  import Routine from 'boost/lib/Routine';
  import { ToolInterface } from 'boost/lib/Tool';
  import { PluginInterface } from 'boost/lib/Plugin';
  import { Context, ToolConfig } from 'boost/lib/types';
  export default class Pipeline<Tp extends PluginInterface, Tx extends Context> extends Routine<ToolConfig, Tx> {
      constructor(tool: ToolInterface);
      run<T>(context: Tx, initialValue?: T | null): Promise<T | null>;
  }

}
declare module 'boost' {
  import ConfigLoader from 'boost/lib/ConfigLoader';
  import { ConsoleInterface } from 'boost/lib/Console';
  import Emitter, { EmitterInterface } from 'boost/lib/Emitter';
  import Event from 'boost/lib/Event';
  import ExitError from 'boost/lib/ExitError';
  import Module, { ModuleInterface } from 'boost/lib/Module';
  import ModuleLoader from 'boost/lib/ModuleLoader';
  import Pipeline from 'boost/lib/Pipeline';
  import Plugin, { PluginInterface } from 'boost/lib/Plugin';
  import Reporter, { ReporterInterface } from 'boost/lib/Reporter';
  import Routine from 'boost/lib/Routine';
  import Tool, { ToolInterface } from 'boost/lib/Tool';
  export { ConfigLoader, ConsoleInterface, Emitter, EmitterInterface, Event, ExitError, Module, ModuleInterface, ModuleLoader, Pipeline, Plugin, PluginInterface, Reporter, ReporterInterface, Routine, Tool, ToolInterface };

}
declare module 'elegant-spinner' {
  export const frames: string[];
  export default function spinner(): () => string;
}
