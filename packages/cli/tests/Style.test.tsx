import React from 'react';
import { Style } from '../src';
import loadTheme from '../src/helpers/loadTheme';
import { renderToString } from './helpers';

jest.mock('term-size');
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

  it('renders `default`', async () => {
    expect(await renderToString(<Style type="default">Test</Style>)).toMatchSnapshot();
  });

  it('renders `default` inverted', async () => {
    expect(
      await renderToString(
        <Style inverted type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `inverted`', async () => {
    expect(await renderToString(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `inverted` inverted', async () => {
    expect(await renderToString(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure`', async () => {
    expect(await renderToString(<Style type="failure">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure` inverted', async () => {
    expect(
      await renderToString(
        <Style inverted type="failure">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `muted`', async () => {
    expect(await renderToString(<Style type="muted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `muted` inverted', async () => {
    expect(
      await renderToString(
        <Style inverted type="muted">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `success`', async () => {
    expect(await renderToString(<Style type="success">Test</Style>)).toMatchSnapshot();
  });

  it('renders `success` inverted', async () => {
    expect(
      await renderToString(
        <Style inverted type="success">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `warning`', async () => {
    expect(await renderToString(<Style type="warning">Test</Style>)).toMatchSnapshot();
  });

  it('renders `warning` inverted', async () => {
    expect(
      await renderToString(
        <Style inverted type="warning">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('supports bold, italics, etc', async () => {
    expect(
      await renderToString(
        <Style bold italic type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  // GH CI terminal does not support hexcodes
  if (!process.env.GITHUB_ACTION) {
    it('supports hexcodes', async () => {
      (loadTheme as jest.Mock).mockImplementation(() => ({
        default: '#fff',
        failure: 'red',
        inverted: '#000',
        muted: '#eee',
        success: 'green',
        warning: 'yellow',
      }));

      expect(await renderToString(<Style type="default">Test</Style>)).toMatchSnapshot();
    });
  }
});
