import React from 'react';
import { render } from 'ink-testing-library';
import { Input } from '../../src/components/Input';

describe('Input', () => {
  it('renders label by default', () => {
    const { lastFrame } = render(<Input label="Name?" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders placeholder if no default value', () => {
    const { lastFrame } = render(<Input label="Name?" placeholder="<name>" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor instead of placeholder if focused', () => {
    const { lastFrame } = render(<Input focused label="Name?" placeholder="<name>" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders default value', () => {
    const { lastFrame } = render(<Input label="Name?" defaultValue="boost" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders value and calls `onChange`', async () => {
    const spy = jest.fn();
    const { lastFrame, stdin } = render(<Input label="Name?" onChange={spy} />);

    await delay();
    stdin.write('custom');
    await delay();

    expect(spy).toHaveBeenCalledWith('custom');
    expect(lastFrame()).toMatchSnapshot();
  });

  it('doesnt call `onChange` on mount', () => {
    const spy = jest.fn();

    render(<Input label="Name?" onChange={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });
});
