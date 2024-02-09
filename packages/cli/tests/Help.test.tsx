import React from 'react';
import { describe, expect,it, vi } from 'vitest';
import { Help } from '../src/react';
import { renderComponent } from '../src/test';
import { commands, options, params } from './__fixtures__/args';

vi.mock('term-size');

describe('<Help />', () => {
	it('renders everything', async () => {
		await expect(
			renderComponent(
				<Help
					commands={commands}
					config={{ description: 'I am a command that does cool things.', usage: '$ ink foo bar' }}
					options={options}
					params={params}
				/>,
			),
		).resolves.toMatchSnapshot();
	});

	describe('config', () => {
		it('renders description', async () => {
			await expect(
				renderComponent(<Help config={{ description: 'I am a command that does cool things.' }} />),
			).resolves.toMatchSnapshot();
		});

		it('renders description with additional params', async () => {
			await expect(
				renderComponent(
					<Help
						config={{ description: 'I am a command that does cool things.', deprecated: true }}
					/>,
				),
			).resolves.toMatchSnapshot();
		});

		it('renders description with markdown', async () => {
			await expect(
				renderComponent(
					<Help
						config={{
							description:
								'This is the top level command description.\nAll descriptions support markdown like **bold**, __strong__, *italics*, _emphasis_, and ~~strikethroughs~~.',
						}}
					/>,
				),
			).resolves.toMatchSnapshot();
		});
	});

	describe('usage', () => {
		it('renders usage string', async () => {
			await expect(
				renderComponent(<Help config={{ description: '', usage: '$ ink foo bar' }} />),
			).resolves.toMatchSnapshot();
		});

		it('renders usage array', async () => {
			await expect(
				renderComponent(
					<Help config={{ description: '', usage: ['$ ink foo bar', '$ test --foo -b'] }} />,
				),
			).resolves.toMatchSnapshot();
		});
	});

	describe('params', () => {
		it('doesnt render empty params', async () => {
			await expect(renderComponent(<Help params={[]} />)).resolves.toMatchSnapshot();
		});

		it('renders params', async () => {
			await expect(renderComponent(<Help params={params} />)).resolves.toMatchSnapshot();
		});

		it('renders params (stripped)', async () => {
			await expect(renderComponent(<Help params={params} />, true)).resolves.toMatchSnapshot();
		});
	});

	describe('commands', () => {
		it('doesnt render empty commands', async () => {
			await expect(renderComponent(<Help commands={{}} />)).resolves.toMatchSnapshot();
		});

		it('renders commands', async () => {
			await expect(renderComponent(<Help commands={commands} />)).resolves.toMatchSnapshot();
		});

		it('renders commands (stripped)', async () => {
			await expect(renderComponent(<Help commands={commands} />, true)).resolves.toMatchSnapshot();
		});
	});

	describe('options', () => {
		it('doesnt render empty options', async () => {
			await expect(renderComponent(<Help options={{}} />)).resolves.toMatchSnapshot();
		});

		it('renders options', async () => {
			await expect(renderComponent(<Help options={options} />)).resolves.toMatchSnapshot();
		});

		it('renders options (stripped)', async () => {
			await expect(renderComponent(<Help options={options} />, true)).resolves.toMatchSnapshot();
		});
	});
});
