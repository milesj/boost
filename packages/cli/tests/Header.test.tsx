import React from 'react';
import { Header } from '../src';
import { renderToString } from './helpers';

describe('<Header />', () => {
  it('renders `default`', () => {
    expect(renderToString(<Header label="Title" type="default" />)).toMatchSnapshot();
  });

  it('renders `muted`', () => {
    expect(renderToString(<Header label="Title" type="muted" />)).toMatchSnapshot();
  });

  it('renders `failure`', () => {
    expect(renderToString(<Header label="Title" type="failure" />)).toMatchSnapshot();
  });

  it('renders `success`', () => {
    expect(renderToString(<Header label="Title" type="success" />)).toMatchSnapshot();
  });

  it('renders `warning`', () => {
    expect(renderToString(<Header label="Title" type="warning" />)).toMatchSnapshot();
  });
});
