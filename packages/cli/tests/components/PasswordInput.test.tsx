import React from 'react';
import { render } from 'ink-testing-library';
import { PasswordInput, PasswordInputProps } from '../../src/components/PasswordInput';

describe('PasswordInput', () => {
  const props: PasswordInputProps = {
    label: 'Password?',
    onSubmit() {},
  };

  it('renders label by default', () => {
    const { lastFrame } = render(<PasswordInput {...props} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders placeholder if no default value', () => {
    const { lastFrame } = render(<PasswordInput {...props} placeholder="<password>" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders default value as stars', () => {
    const { lastFrame } = render(<PasswordInput {...props} defaultValue="test" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders entered text as stars', async () => {
    const { lastFrame, stdin } = render(<PasswordInput {...props} />);

    await delay();
    stdin.write('hello there');
    await delay();

    expect(lastFrame()).toMatchSnapshot();
  });

  it('calls `onChange` with unmasked value', async () => {
    const spy = jest.fn();
    const { stdin } = render(<PasswordInput {...props} onChange={spy} />);

    await delay();
    stdin.write('test');
    await delay();

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('calls `onSubmit` with unmasked value when pressing return', async () => {
    const spy = jest.fn();
    const { stdin } = render(<PasswordInput {...props} onSubmit={spy} />);

    await delay();
    stdin.write('test');
    await delay();
    stdin.write('\r');
    await delay();

    expect(spy).toHaveBeenCalledWith('test');
  });
});
