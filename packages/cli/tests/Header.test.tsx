import React from 'react';
import { Header } from '../src/react';
import { renderComponent } from '../src/test';

jest.mock('term-size');

describe('<Header />', () => {
	it('renders `default`', async () => {
		await expect(renderComponent(<Header label="Title" type="default" />)).resolves.toMatchSnapshot();
	});

	it('renders `muted`', async () => {
		await expect(renderComponent(<Header label="Title" type="muted" />)).resolves.toMatchSnapshot();
	});

	it('renders `failure`', async () => {
		await expect(renderComponent(<Header label="Title" type="failure" />)).resolves.toMatchSnapshot();
	});

	it('renders `success`', async () => {
		await expect(renderComponent(<Header label="Title" type="success" />)).resolves.toMatchSnapshot();
	});

	it('renders `warning`', async () => {
		await expect(renderComponent(<Header label="Title" type="warning" />)).resolves.toMatchSnapshot();
	});
});
