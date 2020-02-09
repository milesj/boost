import { Command, GlobalArgumentOptions } from '../../src';

export interface AllOptions extends GlobalArgumentOptions {
  flag: boolean;
  num: number;
  nums: number[];
  str: string;
  strs: string[];
}

export type AllParams = [string, boolean, number];

export default class AllClassicCommand extends Command<AllOptions, AllParams> {
  static description = 'All options and params';

  static path = 'all';

  flag: boolean = false;

  num: number = 0;

  nums: number[] = [];

  str: string = 'a';

  strs: string[] = [];

  remaining: string[] = [];

  constructor() {
    super();

    this.captureRest('remaining')
      .registerOptions({
        flag: {
          description: 'Boolean flag',
          short: 'F',
          type: 'boolean',
        },
        num: {
          count: true,
          description: 'Single number',
          short: 'N',
          type: 'number',
        },
        nums: {
          deprecated: true,
          description: 'List of numbers',
          multiple: true,
          type: 'number',
        },
        str: {
          choices: ['a', 'b', 'c'],
          default: 'a',
          description: 'Single string',
          hidden: true,
          type: 'string',
        },
        strs: {
          arity: 5,
          description: 'List of strings',
          multiple: true,
          short: 'S',
          type: 'string',
          validate() {
            throw new Error('Oh no...');
          },
        },
      })
      .registerParams([
        {
          description: 'String',
          label: 'char',
          required: true,
          type: 'string',
        },
        {
          description: 'Boolean',
          type: 'boolean',
        },
        {
          description: 'Number',
          label: 'int',
          type: 'number',
        },
      ]);
  }

  async run(str: string, bool: boolean, num: number) {
    await Promise.resolve();

    return 'All the things!';
  }
}
