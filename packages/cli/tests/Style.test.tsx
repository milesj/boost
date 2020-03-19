import React from 'react';
import { Style } from '../src';
import loadTheme from '../src/helpers/loadTheme';
import { renderToString } from './helpers';

jest.mock('../src/helpers/loadTheme');

describe('<Style />', () => {
  beforeEach(() => {
    (loadTheme as jest.Mock).mockImplementation(() => ({
      default: 'white',
      failure: 'red',
      inverted: 'black',
      muted: 'gray',
      success: 'green',
      warning: 'yellow',
    }));
  });

  it('renders `default`', () => {
    expect(renderToString(<Style type="default">Test</Style>)).toMatchSnapshot();
  });

  it('renders `default` inverted', () => {
    expect(
      renderToString(
        <Style inverted type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `inverted`', () => {
    expect(renderToString(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `inverted` inverted', () => {
    expect(renderToString(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure`', () => {
    expect(renderToString(<Style type="failure">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure` inverted', () => {
    expect(
      renderToString(
        <Style inverted type="failure">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `muted`', () => {
    expect(renderToString(<Style type="muted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `muted` inverted', () => {
    expect(
      renderToString(
        <Style inverted type="muted">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `success`', () => {
    expect(renderToString(<Style type="success">Test</Style>)).toMatchSnapshot();
  });

  it('renders `success` inverted', () => {
    expect(
      renderToString(
        <Style inverted type="success">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `warning`', () => {
    expect(renderToString(<Style type="warning">Test</Style>)).toMatchSnapshot();
  });

  it('renders `warning` inverted', () => {
    expect(
      renderToString(
        <Style inverted type="warning">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('supports bold, italics, etc', () => {
    expect(
      renderToString(
        <Style bold italic type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('supports hexcodes', () => {
    (loadTheme as jest.Mock).mockImplementation(() => ({
      default: '#fff',
      failure: 'red',
      inverted: '#000',
      muted: '#eee',
      success: 'green',
      warning: 'yellow',
    }));

    expect(renderToString(<Style type="default">Test</Style>)).toMatchSnapshot();
  });
});
