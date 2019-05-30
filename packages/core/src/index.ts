/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ExitError, SignalError } from '@boost/internal';
import { Plugin } from '@boost/plugin';
import CLI from './CLI';
import ConfigLoader from './ConfigLoader';
import Console from './Console';
import Context from './Context';
import Emitter, { EventArguments, EventListener } from './Emitter';
import { AggregatedResponse } from './Executor';
import ModuleLoader from './ModuleLoader';
import Output from './Output';
import Pipeline, { PipelineOptions } from './Pipeline';
import Reporter from './Reporter';
import Routine, { CommandOptions } from './Routine';
import Task, { TaskAction, TaskMetadata } from './Task';
import Tool, { ToolOptions, ToolConfig, ToolPluginRegistry } from './Tool';

export {
  AggregatedResponse,
  CLI,
  CommandOptions,
  ConfigLoader,
  Console,
  Context,
  Emitter,
  EventArguments,
  EventListener,
  ExitError,
  ModuleLoader,
  Output,
  Pipeline,
  PipelineOptions,
  Plugin,
  Reporter,
  Routine,
  SignalError,
  Task,
  TaskAction,
  TaskMetadata,
  Tool,
  ToolConfig,
  ToolOptions,
  ToolPluginRegistry,
};

export * from './constants';
export * from './types';
