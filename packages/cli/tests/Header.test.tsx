import React from 'react';
import { Header } from '../src/react';
import { renderComponent } from '../src/test';

describe('<Header />', () => {
	it('renders `default`', async () => {
		expect(await renderComponent(<Header label="Title" type="default" />)).toMatchSnapshot();
	});

	it('renders `muted`', async () => {
		expect(await renderComponent(<Header label="Title" type="muted" />)).toMatchSnapshot();
	});

	it('renders `failure`', async () => {
		expect(await renderComponent(<Header label="Title" type="failure" />)).toMatchSnapshot();
	});

	it('renders `success`', async () => {
		expect(await renderComponent(<Header label="Title" type="success" />)).toMatchSnapshot();
	});

	it('renders `warning`', async () => {
		expect(await renderComponent(<Header label="Title" type="warning" />)).toMatchSnapshot();
	});
});
