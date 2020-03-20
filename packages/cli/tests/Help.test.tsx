import React from 'react';
import { Help, ParamConfigList, CommandConfigMap, OptionConfigMap } from '../src';
import { renderToString, renderToStrippedString } from './helpers';

describe('<Help />', () => {
  const commands: CommandConfigMap = {
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
  };

  const options: OptionConfigMap = {
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
  };

  const params: ParamConfigList = [
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
  ];

  it('renders everything', async () => {
    expect(
      await renderToString(
        <Help
          config={{ description: 'I am a command that does cool things.', usage: '$ ink foo bar' }}
          commands={commands}
          options={options}
          params={params}
        />,
      ),
    ).toMatchSnapshot();
  });

  describe('config', () => {
    it('renders description', async () => {
      expect(
        await renderToString(
          <Help config={{ description: 'I am a command that does cool things.' }} />,
        ),
      ).toMatchSnapshot();
    });

    it('renders description with additional params', async () => {
      expect(
        await renderToString(
          <Help
            config={{ description: 'I am a command that does cool things.', deprecated: true }}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('renders description with markdown', async () => {
      expect(
        await renderToString(
          <Help
            config={{
              description:
                'This is the top level command description.\nAll descriptions support markdown like **bold**, __strong__, *italics*, _emphasis_, and ~~strikethroughs~~.',
            }}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('usage', () => {
    it('renders usage string', async () => {
      expect(
        await renderToString(<Help config={{ description: '', usage: '$ ink foo bar' }} />),
      ).toMatchSnapshot();
    });

    it('renders usage array', async () => {
      expect(
        await renderToString(
          <Help config={{ description: '', usage: ['$ ink foo bar', '$ test --foo -b'] }} />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('params', () => {
    it('renders params', async () => {
      expect(await renderToString(<Help params={params} />)).toMatchSnapshot();
    });

    it('renders params (stripped)', async () => {
      expect(await renderToStrippedString(<Help params={params} />)).toMatchSnapshot();
    });
  });

  describe('commands', () => {
    it('renders commands', async () => {
      expect(await renderToString(<Help commands={commands} />)).toMatchSnapshot();
    });

    it('renders commands (stripped)', async () => {
      expect(await renderToStrippedString(<Help commands={commands} />)).toMatchSnapshot();
    });
  });

  describe('options', () => {
    it('renders options', async () => {
      expect(await renderToString(<Help options={options} />)).toMatchSnapshot();
    });

    it('renders options (stripped)', async () => {
      expect(await renderToStrippedString(<Help options={options} />)).toMatchSnapshot();
    });
  });
});
