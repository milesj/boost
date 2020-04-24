import React from 'react';
import { Header } from '../src';
import { renderToString } from '../src/testing';

jest.mock('term-size');

describe('<Header />', () => {
  it('renders `default`', async () => {
    expect(await renderToString(<Header label="Title" type="default" />)).toMatchSnapshot();
  });

  it('renders `muted`', async () => {
    expect(await renderToString(<Header label="Title" type="muted" />)).toMatchSnapshot();
  });

  it('renders `failure`', async () => {
    expect(await renderToString(<Header label="Title" type="failure" />)).toMatchSnapshot();
  });

  it('renders `success`', async () => {
    expect(await renderToString(<Header label="Title" type="success" />)).toMatchSnapshot();
  });

  it('renders `warning`', async () => {
    expect(await renderToString(<Header label="Title" type="warning" />)).toMatchSnapshot();
  });
});
