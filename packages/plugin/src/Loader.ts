import { PathResolver } from '@boost/common';
import { createDebugger, Debugger } from '@boost/debug';
import { PluginType, Pluggable } from './types';
// import formatModuleName from './formatModuleName';

export default class Loader<Plugin extends Pluggable> {
  readonly debug: Debugger;

  readonly type: PluginType<Plugin>;

  private resolver: PathResolver;

  constructor(type: PluginType<Plugin>) {
    this.type = type;
    this.debug = createDebugger(`${type.singularName}-loader`);
    this.resolver = new PathResolver();
  }
}
