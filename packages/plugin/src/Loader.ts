import path from 'path';
import { Path, requireModule } from '@boost/common';
import { color, createDebugger, Debugger } from '@boost/debug';
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
}
