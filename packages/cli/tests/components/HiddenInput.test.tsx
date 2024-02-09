import React from 'react';
import { render } from 'ink-testing-library';
import { HiddenInput, HiddenInputProps } from '../../src/components/HiddenInput';
import { vi, describe, it, expect } from 'vitest';

describe('HiddenInput', () => {
	const props: HiddenInputProps = {
		label: 'Age?',
		onSubmit() {},
	};

	it('renders label by default', () => {
		const { lastFrame } = render(<HiddenInput {...props} />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders placeholder if no default value', () => {
		const { lastFrame } = render(<HiddenInput {...props} placeholder="<number>" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders default value as stars', () => {
		const { lastFrame } = render(<HiddenInput {...props} defaultValue="test" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders entered text as stars', async () => {
		const { lastFrame, stdin } = render(<HiddenInput {...props} />);

		await delay();
		stdin.write('666');
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('calls `onChange` with unmasked value', async () => {
		const spy = vi.fn();
		const { stdin } = render(<HiddenInput {...props} onChange={spy} />);

		await delay();
		stdin.write('15');
		await delay();

		expect(spy).toHaveBeenCalledWith('15');
	});

	it('calls `onSubmit` with unmasked value when pressing return', async () => {
		const spy = vi.fn();
		const { stdin } = render(<HiddenInput {...props} onSubmit={spy} />);

		await delay();
		stdin.write('25');
		await delay();
		stdin.write('\r');
		await delay();

		expect(spy).toHaveBeenCalledWith('25');
	});
});
