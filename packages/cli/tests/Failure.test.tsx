import React from 'react';
import { ParseError, ValidationError } from '@boost/args';
import { Failure } from '../src';
import { renderToString, renderToStrippedString } from './helpers';

describe('<Failure />', () => {
  it('renders a common error', async () => {
    expect(
      await renderToString(<Failure error={new Error('Something is broken!')} />),
    ).toMatchSnapshot();
  });

  it('doesnt render code frame if a common error', async () => {
    expect(
      await renderToString(
        <Failure error={new Error('Something is broken!')} commandLine="foo --bar" />,
      ),
    ).toMatchSnapshot();
  });

  it('renders an error with warnings', async () => {
    const warnings = [
      new Error('This is invalid.'),
      new Error('This is also invalid. Please fix.'),
    ];

    expect(
      await renderToString(
        <Failure error={new Error('Something is broken!')} warnings={warnings} />,
      ),
    ).toMatchSnapshot();
  });

  it('renders a parse error', async () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(await renderToString(<Failure error={error} />)).toMatchSnapshot();
  });

  it('renders a parse error with a command line', async () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(
      await renderToStrippedString(
        <Failure error={error} commandLine="bin --foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });

  it('renders a validation error', async () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(await renderToString(<Failure error={error} />)).toMatchSnapshot();
  });

  it('renders a validation error with a command line', async () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(
      await renderToStrippedString(
        <Failure error={error} commandLine="bin --foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });

  it('reduces command line by half when index appears off screen', async () => {
    const line = `bin --foo value --bar "${'w'.repeat(200)}" --flag=123 -gSA "${'m'.repeat(75)}"`;

    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      line.indexOf('--flag=123'),
    );

    expect(
      await renderToStrippedString(<Failure error={error} commandLine={line} />),
    ).toMatchSnapshot();
  });
});