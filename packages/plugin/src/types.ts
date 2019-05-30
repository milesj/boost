import { Optionable } from '@boost/common';

export interface Pluggable<T extends object> extends Optionable<T> {
  // Name of the Node module/package it was loaded from
  moduleName?: string;

  // Name of the plugin
  name?: string;

  // Priority in which to sort and run the plugin
  priority?: number;
}
