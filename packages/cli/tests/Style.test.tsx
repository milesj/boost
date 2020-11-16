import React from 'react';
import { Style } from '../src';
import loadTheme from '../src/helpers/loadTheme';
import { renderComponent } from '../src/test';

jest.mock('term-size');
jest.mock('../src/helpers/loadTheme');

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

  it('renders `default`', async () => {
    expect(await renderComponent(<Style type="default">Test</Style>)).toMatchSnapshot();
  });

  it('renders `default` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `info`', async () => {
    expect(await renderComponent(<Style type="info">Test</Style>)).toMatchSnapshot();
  });

  it('renders `info` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="info">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `inverted`', async () => {
    expect(await renderComponent(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `inverted` inverted', async () => {
    expect(await renderComponent(<Style type="inverted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure`', async () => {
    expect(await renderComponent(<Style type="failure">Test</Style>)).toMatchSnapshot();
  });

  it('renders `failure` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="failure">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `muted`', async () => {
    expect(await renderComponent(<Style type="muted">Test</Style>)).toMatchSnapshot();
  });

  it('renders `muted` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="muted">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `notice`', async () => {
    expect(await renderComponent(<Style type="notice">Test</Style>)).toMatchSnapshot();
  });

  it('renders `notice` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="notice">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `success`', async () => {
    expect(await renderComponent(<Style type="success">Test</Style>)).toMatchSnapshot();
  });

  it('renders `success` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="success">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('renders `warning`', async () => {
    expect(await renderComponent(<Style type="warning">Test</Style>)).toMatchSnapshot();
  });

  it('renders `warning` inverted', async () => {
    expect(
      await renderComponent(
        <Style inverted type="warning">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
  });

  it('supports bold, italics, etc', async () => {
    expect(
      await renderComponent(
        <Style bold italic type="default">
          Test
        </Style>,
      ),
    ).toMatchSnapshot();
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
