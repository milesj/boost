import React from 'react';
import { ParseError, ValidationError } from '@boost/args';
import { Failure } from '../src';
import { renderToString, renderToStrippedString } from './helpers';

describe('<Failure />', () => {
  it('renders a common error', () => {
    expect(renderToString(<Failure error={new Error('Something is broken!')} />)).toMatchSnapshot();
  });

  it('renders an error with warnings', () => {
    const warnings = [
      new Error('This is invalid.'),
      new Error('This is also invalid. Please fix.'),
    ];

    expect(
      renderToString(<Failure error={new Error('Something is broken!')} warnings={warnings} />),
    ).toMatchSnapshot();
  });

  it('renders a parse error', () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(renderToString(<Failure error={error} />)).toMatchSnapshot();
  });

  it('renders a parse error with a command line', () => {
    const error = new ParseError(
      'Flags and short option groups may not use inline values.',
      '--flag=123',
      16,
    );

    expect(
      renderToStrippedString(
        <Failure error={error} commandLine="bin --foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });

  it('renders a validation error', () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(renderToString(<Failure error={error} />)).toMatchSnapshot();
  });

  it('renders a validation error with a command line', () => {
    const error = new ValidationError('Not enough arity arguments.', 'foo');

    expect(
      renderToStrippedString(
        <Failure error={error} commandLine="bin --foo value --flag=123 -gSA" />,
      ),
    ).toMatchSnapshot();
  });
});
