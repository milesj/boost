import React from 'react';
import { ParseError, ValidationError } from '@boost/args';
import { jest } from '@jest/globals';
import { Failure } from '../src/react';
import { renderComponent } from '../src/test';

jest.mock('term-size');

describe('<Failure />', () => {
	it('renders a common error', async () => {
		expect(
			await renderComponent(<Failure binName="boost" error={new Error('Something is broken!')} />),
		).toMatchSnapshot();
	});

	it('doesnt render code frame if a common error', async () => {
		expect(
			await renderComponent(
				<Failure
					binName="boost"
					commandLine="foo --bar"
					error={new Error('Something is broken!')}
				/>,
			),
		).toMatchSnapshot();
	});

	it('doesnt render code frame if arg not found', async () => {
		const error = new ParseError(
			'Flags and short option groups may not use inline values.',
			'--flag=123',
			16,
		);

		expect(
			await renderComponent(<Failure binName="boost" commandLine="foo --bar" error={error} />),
		).toMatchSnapshot();
	});

	it('renders an error with warnings', async () => {
		const warnings = [
			new Error('This is invalid.'),
			new Error('This is also invalid. Please fix.'),
		];

		const out = await renderComponent(
			<Failure binName="boost" error={new Error('Something is broken!')} warnings={warnings} />,
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

		expect(await renderComponent(<Failure binName="boost" error={error} />)).toMatchSnapshot();
	});

	it('renders a parse error with a command line', async () => {
		const error = new ParseError(
			'Flags and short option groups may not use inline values.',
			'--flag=123',
			16,
		);

		expect(
			await renderComponent(
				<Failure binName="boost" commandLine="--foo value --flag=123 -gSA" error={error} />,
				true,
			),
		).toMatchSnapshot();
	});

	it('renders a validation error', async () => {
		const error = new ValidationError('Not enough arity arguments.', 'foo');

		expect(await renderComponent(<Failure binName="boost" error={error} />)).toMatchSnapshot();
	});

	it('renders a validation error with a command line', async () => {
		const error = new ValidationError('Not enough arity arguments.', 'foo');

		expect(
			await renderComponent(
				<Failure binName="boost" commandLine="--foo value --flag=123 -gSA" error={error} />,
				true,
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
			await renderComponent(<Failure binName="boost" commandLine={line} error={error} />, true),
		).toMatchSnapshot();
	});
});
