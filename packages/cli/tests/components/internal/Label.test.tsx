import React from 'react';
import { Text } from 'ink';
import { render } from 'ink-testing-library';
import { Label } from '../../../src/components/internal/Label';

describe('Label', () => {
	it('renders a string wrapped in text', () => {
		const { lastFrame } = render(<Label>Content</Label>);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders an element', () => {
		const { lastFrame } = render(
			<Label>
				<Text color="red">Content</Text>
			</Label>,
		);

		expect(lastFrame()).toMatchSnapshot();
	});
});
