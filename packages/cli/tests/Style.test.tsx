import React from 'react';
import { loadTheme } from '../src/helpers/loadTheme';
import { Style } from '../src/react';
import { renderComponent } from '../src/test';
import { vi } from 'vitest';
import { describe, beforeEach, it, expect } from 'vitest';

vi.mock('term-size');
vi.mock('../src/helpers/loadTheme');

describe('<Style />', () => {
	beforeEach(() => {
		(loadTheme as jest.Mock).mockImplementation(() => ({
			default: 'white',
			failure: 'red',
			info: 'cyan',
			inverted: 'black',
			muted: 'gray',
			notice: 'magenta',
			success: 'green',
			warning: 'yellow',
		}));
	});

	it('renders `none`', async () => {
		await expect(renderComponent(<Style>Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `none` inverted', async () => {
		await expect(renderComponent(<Style inverted>Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `default`', async () => {
		await expect(renderComponent(<Style type="default">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `default` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="default">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `info`', async () => {
		await expect(renderComponent(<Style type="info">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `info` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="info">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `inverted`', async () => {
		await expect(renderComponent(<Style type="inverted">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `inverted` inverted', async () => {
		await expect(renderComponent(<Style type="inverted">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `failure`', async () => {
		await expect(renderComponent(<Style type="failure">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `failure` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="failure">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `muted`', async () => {
		await expect(renderComponent(<Style type="muted">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `muted` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="muted">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `notice`', async () => {
		await expect(renderComponent(<Style type="notice">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `notice` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="notice">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `success`', async () => {
		await expect(renderComponent(<Style type="success">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `success` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="success">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('renders `warning`', async () => {
		await expect(renderComponent(<Style type="warning">Test</Style>)).resolves.toMatchSnapshot();
	});

	it('renders `warning` inverted', async () => {
		await expect(
			renderComponent(
				<Style inverted type="warning">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	it('supports bold, italics, etc', async () => {
		await expect(
			renderComponent(
				<Style bold italic type="default">
					Test
				</Style>,
			),
		).resolves.toMatchSnapshot();
	});

	// TODO: GH CI terminal does not support hexcodes
	// it('supports hexcodes', async () => {
	//   (loadTheme as jest.Mock).mockImplementation(() => ({
	//     default: '#fff',
	//     failure: 'red',
	//     inverted: '#000',
	//     muted: '#eee',
	//     success: 'green',
	//     warning: 'yellow',
	//   }));

	//   expect(await renderToString(<Style type="default">Test</Style>)).toMatchSnapshot();
	// });
});
