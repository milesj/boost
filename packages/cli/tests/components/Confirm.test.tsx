import React from 'react';
import { render } from 'ink-testing-library';
import { Confirm, ConfirmProps } from '../../src/components/Confirm';

describe('Confirm', () => {
	const props: ConfirmProps = {
		label: 'Confirm?',
		onSubmit() {},
	};

	it('renders label with yes/no by default', () => {
		const { lastFrame } = render(<Confirm {...props} />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('can customize yes/no', () => {
		const { lastFrame } = render(<Confirm {...props} no="F" yes="t" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('console errors if `yes` is invalid', async () => {
		const spy = jest.spyOn(console, 'error').mockImplementation();

		render(<Confirm {...props} yes="" />);

		await delay();

		expect(spy).toHaveBeenCalledWith('Prop "yes" must be a single character.');

		spy.mockRestore();
	});

	it('console errors if `no` is invalid', async () => {
		const spy = jest.spyOn(console, 'error').mockImplementation();

		render(<Confirm {...props} no="" />);

		await delay();

		expect(spy).toHaveBeenCalledWith('Prop "no" must be a single character.');

		spy.mockRestore();
	});

	it('errors for invalid input value', async () => {
		const { lastFrame, stdin } = render(<Confirm {...props} />);

		await delay();
		stdin.write('g');
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('errors with custom message', async () => {
		const { lastFrame, stdin } = render(<Confirm {...props} invalidError="Wrong value yo" />);

		await delay();
		stdin.write('g');
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('errors for incorrectly cased input value', async () => {
		const { lastFrame, stdin } = render(<Confirm {...props} />);

		await delay();
		stdin.write('Y');
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('doesnt call `onSubmit` invalid input value', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Confirm {...props} onSubmit={spy} />);

		await delay();
		stdin.write('g');
		await delay();

		expect(spy).not.toHaveBeenCalled();
	});

	describe('truthy', () => {
		it('renders success state', async () => {
			const { lastFrame, stdin } = render(<Confirm {...props} />);

			await delay();
			stdin.write('y');
			await delay();

			expect(lastFrame()).toMatchSnapshot();
		});

		it('calls `onSubmit`', async () => {
			const spy = jest.fn();
			const { stdin } = render(<Confirm {...props} onSubmit={spy} />);

			await delay();
			stdin.write('y');
			await delay();

			expect(spy).toHaveBeenCalledWith(true);
		});
	});

	describe('falsy', () => {
		it('renders success state', async () => {
			const { lastFrame, stdin } = render(<Confirm {...props} />);

			await delay();
			stdin.write('N');
			await delay();

			expect(lastFrame()).toMatchSnapshot();
		});

		it('calls `onSubmit`', async () => {
			const spy = jest.fn();
			const { stdin } = render(<Confirm {...props} onSubmit={spy} />);

			await delay();
			stdin.write('N');
			await delay();

			expect(spy).toHaveBeenCalledWith(false);
		});
	});
});
