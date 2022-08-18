import React from 'react';
import { ParseError, ValidationError } from '@boost/args';
import { Failure } from '../src/react';
import { renderComponent } from '../src/test';

jest.mock('term-size');

describe('<Failure />', () => {
	it('renders a common error', async () => {
		await expect(
			renderComponent(<Failure binName="boost" error={new Error('Something is broken!')} />),
		).resolves.toMatchSnapshot();
	});

	it('doesnt render code frame if a common error', async () => {
		await expect(
			renderComponent(
				<Failure
					binName="boost"
					commandLine="foo --bar"
					error={new Error('Something is broken!')}
				/>,
			),
		).resolves.toMatchSnapshot();
	});

	it('doesnt render code frame if arg not found', async () => {
		const error = new ParseError(
			'Flags and short option groups may not use inline values.',
			'--flag=123',
			16,
		);

		await expect(
			renderComponent(<Failure binName="boost" commandLine="foo --bar" error={error} />),
		).resolves.toMatchSnapshot();
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

		await expect(
			renderComponent(<Failure binName="boost" error={error} />),
		).resolves.toMatchSnapshot();
	});

	it('renders a parse error with a command line', async () => {
		const error = new ParseError(
			'Flags and short option groups may not use inline values.',
			'--flag=123',
			16,
		);

		await expect(
			renderComponent(
				<Failure binName="boost" commandLine="--foo value --flag=123 -gSA" error={error} />,
				true,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders a validation error', async () => {
		const error = new ValidationError('Not enough arity arguments.', 'foo');

		await expect(
			renderComponent(<Failure binName="boost" error={error} />),
		).resolves.toMatchSnapshot();
	});

	it('renders a validation error with a command line', async () => {
		const error = new ValidationError('Not enough arity arguments.', 'foo');

		await expect(
			renderComponent(
				<Failure binName="boost" commandLine="--foo value --flag=123 -gSA" error={error} />,
				true,
			),
		).resolves.toMatchSnapshot();
	});

	it('reduces command line by half when index appears off screen', async () => {
		const line = `--foo value --bar "${'w'.repeat(100)}" --flag=123 -gSA "${'m'.repeat(75)}"`;

		const error = new ParseError(
			'Flags and short option groups may not use inline values.',
			'--flag=123',
			line.indexOf('--flag=123'),
		);

		await expect(
			renderComponent(<Failure binName="boost" commandLine={line} error={error} />, true),
		).resolves.toMatchSnapshot();
	});
});
