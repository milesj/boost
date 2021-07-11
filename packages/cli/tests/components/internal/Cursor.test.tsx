import React from 'react';
import { render } from 'ink-testing-library';
import { Cursor } from '../../../src/components/internal/Cursor';

describe('Cursor', () => {
	it('renders value with no cursor if not focused', () => {
		const { lastFrame } = render(<Cursor position={0} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders no cursor if `hideCursor` is passed', () => {
		const { lastFrame } = render(<Cursor hideCursor position={0} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders cursor at the start', () => {
		const { lastFrame } = render(<Cursor focused position={0} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders cursor at the end', () => {
		const { lastFrame } = render(<Cursor focused position={18} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders cursor in the middle', () => {
		const { lastFrame } = render(<Cursor focused position={8} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders cursor after value', () => {
		const { lastFrame } = render(<Cursor focused position={19} value="Some string of text" />);

		expect(lastFrame()).toMatchSnapshot();
	});
});
