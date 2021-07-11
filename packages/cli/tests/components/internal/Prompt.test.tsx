import React from 'react';
import { Box, Text } from 'ink';
import { render } from 'ink-testing-library';
import { Prompt } from '../../../src/components/internal/Prompt';
import { KEYS } from '../../helpers';

// http://ascii-table.com/ansi-escape-sequences-vt-100.php
describe('Prompt', () => {
	it('renders default state', () => {
		const { lastFrame } = render(<Prompt label="Label" value="" />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders content before and after label', () => {
		const { lastFrame } = render(
			<Prompt
				beforeLabel={<Text>Before</Text>}
				label="Label"
				afterLabel={<Text>After</Text>}
				value=""
			/>,
		);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders content below label when focused', () => {
		const { lastFrame } = render(
			<Prompt focused label="Label" value="">
				<Box>
					<Text>Foo</Text>
				</Box>
				<Box>
					<Text>Bar</Text>
				</Box>
				<Box>
					<Text>Baz</Text>
				</Box>
			</Prompt>,
		);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('doesnt render content below label when not focused', () => {
		const { lastFrame } = render(
			<Prompt label="Label" value="">
				<Box>
					<Text>Foo</Text>
				</Box>
				<Box>
					<Text>Bar</Text>
				</Box>
				<Box>
					<Text>Baz</Text>
				</Box>
			</Prompt>,
		);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders error below label and above content', async () => {
		const { lastFrame, stdin } = render(
			<Prompt
				focused
				label="Label"
				value=""
				validate={() => {
					throw new Error('Failed validation');
				}}
			>
				<Box>
					<Text>Foo</Text>
				</Box>
			</Prompt>,
		);

		await delay();
		stdin.write(KEYS.return);
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders success after return submission', async () => {
		const { lastFrame, stdin } = render(
			<Prompt label="Label" value="" onReturn={() => true}>
				<Box>
					<Text>Foo</Text>
				</Box>
			</Prompt>,
		);

		await delay();
		stdin.write(KEYS.return);
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders success after input submission', async () => {
		const { lastFrame, stdin } = render(
			<Prompt label="Label" value="" onInput={() => true}>
				<Box>
					<Text>Foo</Text>
				</Box>
			</Prompt>,
		);

		await delay();
		stdin.write('a');
		await delay();

		expect(lastFrame()).toMatchSnapshot();
	});

	it('calls `onKeyUp` for up arrow', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onKeyUp={spy} />);

		await delay();
		stdin.write(KEYS.up);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onKeyDown` for down arrow', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onKeyDown={spy} />);

		await delay();
		stdin.write(KEYS.down);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onKeyRight` for right arrow', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onKeyRight={spy} />);

		await delay();
		stdin.write(KEYS.right);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onKeyLeft` for left arrow', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onKeyLeft={spy} />);

		await delay();
		stdin.write(KEYS.left);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onPageUp` for page up', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onPageUp={spy} />);

		await delay();
		stdin.write(KEYS.pageUp);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onPageDown` for page down', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onPageDown={spy} />);

		await delay();
		stdin.write(KEYS.pageDown);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onTab` for tab', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onTab={spy} />);

		await delay();
		stdin.write(KEYS.tab);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onBackspace` for backspace', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onBackspace={spy} />);

		await delay();
		stdin.write(KEYS.backspace);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onDelete` for delete', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onDelete={spy} />);

		await delay();
		stdin.write(KEYS.delete);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onReturn` for return/enter', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onReturn={spy} />);

		await delay();
		stdin.write(KEYS.return);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onEscape` for escape', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onEscape={spy} />);

		await delay();
		stdin.write(KEYS.escape);
		await delay();

		expect(spy).toHaveBeenCalled();
	});

	it('calls `onInput` for standard characters', async () => {
		const spy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onInput={spy} />);

		await delay();
		stdin.write('a');
		await delay();

		expect(spy).toHaveBeenCalledWith('a', expect.any(Object));
	});

	it('calls `onSpace` (if provided) for space character', async () => {
		const spaceSpy = jest.fn();
		const inputSpy = jest.fn();
		const { stdin } = render(
			<Prompt label="Label" value="" onSpace={spaceSpy} onInput={inputSpy} />,
		);

		await delay();
		stdin.write(' ');
		await delay();

		expect(spaceSpy).toHaveBeenCalledWith(expect.any(Object));
		expect(inputSpy).not.toHaveBeenCalled();
	});

	it('calls `onInput` for space character if `onSpace` is not provided', async () => {
		const inputSpy = jest.fn();
		const { stdin } = render(<Prompt label="Label" value="" onInput={inputSpy} />);

		await delay();
		stdin.write(' ');
		await delay();

		expect(inputSpy).toHaveBeenCalledWith(' ', expect.any(Object));
	});
});
