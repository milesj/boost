const React = require('react');
const { render } = require('ink');
const chalk = require('chalk');
const { ParseError, ValidationError } = require('@boost/args');
const Failure = require('@boost/cli/lib/Failure').default;
const Help = require('@boost/cli/lib/Help').default;

const props = {
  config: {
    description:
      'This is the top level command description.\nAll descriptions support markdown like **bold**, __strong__, *italics*, _emphasis_, and ~~strikethroughs~~.',
    usage: ['$ ink foo bar', '$ test --foo -b'],
  },
  commands: {
    foo: {
      description: 'This is a normal command with params.',
      params: [
        { description: '', label: 'src', required: true, type: 'string' },
        { description: '', label: 'dst', type: 'string' },
      ],
    },
    barbar: {
      deprecated: true,
      description: 'This is a deprecated command with no params.',
    },
    baz: {
      description: 'This is a hidden command.',
      hidden: true,
    },
  },
  options: {
    str: {
      description: 'Standard string option.',
      type: 'string',
    },
    deprecatedStringWithALongName: {
      deprecated: true,
      description: 'Deprecated string option with custom label.',
      type: 'string',
    },
    flag: {
      description: 'Standard boolean option.',
      type: 'boolean',
    },
    stringChoices: {
      choices: ['foo', 'bar', 'baz'],
      default: 'bar',
      description: 'Choice list with strings.',
      short: 's',
      type: 'string',
    },
    numberFixedList: {
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      deprecated: true,
      description: 'A list of numbers to choose from.',
      short: 'n',
      type: 'number',
    },
    numHidden: {
      hidden: true,
      description: 'Hidden number option.',
      type: 'number',
    },
    numberCountable: {
      count: true,
      default: 10,
      description: 'Number option that increments a count for each occurence.',
      short: 'C',
      type: 'number',
    },
    deprecatedFlag: {
      deprecated: true,
      description: 'A deprecated flag.',
      type: 'boolean',
    },
    numWithArity: {
      arity: 10,
      description: 'A multiple number option that requires an exact number of values.',
      multiple: true,
      type: 'number',
    },
    strList: {
      description: 'String option list.',
      multiple: true,
      short: 'S',
      type: 'string',
    },
    truthyBool: {
      default: true,
      description: 'Flag that is on by default, so name should be negated.',
      short: 't',
      type: 'boolean',
    },
    num: {
      description: 'Standard number option.',
      type: 'number',
    },
  },
  params: [
    {
      deprecated: true,
      description: 'Complex param with many tags.',
      type: 'string',
      required: true,
    },
    {
      default: 'value',
      description: 'This is a string param thats required.',
      label: 'path',
      type: 'string',
      required: true,
    },
    {
      default: 300,
      description: 'And this a number param with a label.',
      label: 'ms',
      type: 'number',
    },
    {
      default: true,
      deprecated: true,
      description: 'And finally a boolean param.',
      type: 'boolean',
    },
    {
      description: 'This should be hidden.',
      hidden: true,
      type: 'boolean',
    },
  ],
};

async function run() {
  let res = render(React.createElement(Help, props));

  await res.waitUntilExit();

  // const error = new ParseError('Flags and short option groups may not use inline values.');
  // error.arg = '--flag=123';
  // error.index = 16;

  const error = new ValidationError('Not enough arity arguments. Require %d, found %d.');
  error.option = 'foo';

  res = render(
    React.createElement(Failure, {
      command: 'bin --foo value --flag=123 -gSA',
      // error: new Error('Something has happened.'),
      error,
      warnings: [new Error('This is invalid.'), new Error('This is also invalid. Please fix.')],
    }),
  );

  await res.waitUntilExit();
}

run();
