/* eslint-disable max-classes-per-file */

import { Command } from '../../src';

export class Parent extends Command {
  static description = 'Description';

  static path = 'parent';

  run() {
    return Promise.resolve('parent');
  }
}

export class Child extends Command {
  static description = 'Description';

  static path = 'parent:child';

  run() {
    return Promise.resolve('parent:child');
  }
}

export class GrandChild extends Command {
  static description = 'Description';

  static path = 'parent:child:grandchild';

  run() {
    return Promise.resolve('parent:child:grandchild');
  }
}

export class UnknownChild extends Command {
  static description = 'Description';

  static path = 'unknown';

  run() {
    return Promise.resolve('unknown');
  }
}

export class UnknownGrandChild extends Command {
  static description = 'Description';

  static path = 'parent:unknown';

  run() {
    return Promise.resolve('parent:unknown');
  }
}
