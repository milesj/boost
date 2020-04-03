import React from 'react';
import { ParseError, ValidationError } from '@boost/args';
import { Failure } from '../src';
import { renderToString, renderToStrippedString } from './helpers';

jest.mock('term-size');

describe('<Failure />', () => {
  it('renders a common error', async () => {
    expect(
      await renderToString(<Failure error={new Error('Something is broken!')} binName="boost" />),
    ).toMatchSnapshot();
  });

  it('doesnt render code frame if a common error', async () => {
    expect(
      await renderToString(
        <Failure
          error={new Error('Something is broken!')}
          binName="boost"
          commandLine="foo --bar"
        />,
      ),
    ).toMatchSnapshot();
  });

  it('renders an error with warnings', async () => {
    const warnings = [
      new Error('This is invalid.'),
      new Error('This is also invalid. Please fix.'),
    ];

    const out = await renderToString(
      <Failure error={new Error('Something is broken!')} binName="boost" warnings={warnings} />,
    );

    // Do not use snapshots a they differ on windows
    expect(out).toContain('This is invalid.');
    expect(out).toContain('This is also invalid. Please fix.');
  });

  it('renders a parse error', async () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(await renderToString(<Failure binName="boost" error={error} />)).toMatchSnapshot();
  });

  it('renders a parse error with a command line', async () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(
      await renderToStrippedString(
        <Failure error={error} binName="boost" commandLine="--foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });

  it('renders a validation error', async () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(await renderToString(<Failure binName="boost" error={error} />)).toMatchSnapshot();
  });

  it('renders a validation error with a command line', async () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(
      await renderToStrippedString(
        <Failure error={error} binName="boost" commandLine="--foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });

  it('reduces command line by half when index appears off screen', async () => {
    const line = `--foo value --bar "${'w'.repeat(100)}" --flag=123 -gSA "${'m'.repeat(75)}"`;

    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      line.indexOf('--flag=123'),
    );

    expect(
      await renderToStrippedString(<Failure binName="boost" error={error} commandLine={line} />),
    ).toMatchSnapshot();
  });
});
