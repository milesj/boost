import React from 'react';
import { render } from 'ink-testing-library';
import { Input, InputProps } from '../../src/components/Input';

describe('Input', () => {
  const props: InputProps = {
    label: 'Name?',
    onSubmit() {},
  };

  it('renders label by default', () => {
    const { lastFrame } = render(<Input {...props} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders placeholder if no default value', () => {
    const { lastFrame } = render(<Input {...props} placeholder="<name>" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor instead of placeholder if value is dirty', async () => {
    const { lastFrame, stdin } = render(<Input {...props} placeholder="<name>" />);

    await delay();
    stdin.write('a');
    await delay(10);
    stdin.write('\u0008'); // remove so value is empty
    await delay();

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders default value', () => {
    const { lastFrame } = render(<Input {...props} defaultValue="boost" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('calls `onSubmit` when pressing return', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Input {...props} onSubmit={spy} />);

    await delay();
    stdin.write('test');
    await delay();
    stdin.write('\r');
    await delay();

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('trims the submitted value', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Input {...props} onSubmit={spy} />);

    await delay();
    stdin.write('  test    ');
    await delay();
    stdin.write('\r');
    await delay();

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('doesnt call `onChange` on mount', () => {
    const spy = jest.fn();

    render(<Input {...props} onChange={spy} />);

    expect(spy).not.toHaveBeenCalled();
  });

  describe('adding characters', () => {
    it('can add subsequent characters', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('a');
      await delay(10);
      stdin.write('b');
      await delay(10);
      stdin.write('c');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can add to the beginning', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('foo');
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write('\u001B[A'); // key up
      await delay();

      stdin.write('bar');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can add to the beginning and end', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('foo');
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write('\u001B[A'); // key up
      await delay(10);
      stdin.write('bar');
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write('\u001B[B'); // key down
      await delay(10);
      stdin.write('qux');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can add to the middle', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('foobar');
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write('\u001B[D'); // key left
      stdin.write('\u001B[D');
      stdin.write('\u001B[D');
      await delay();

      stdin.write('qux');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders value and calls `onChange`', async () => {
      const spy = jest.fn();
      const { lastFrame, stdin } = render(<Input {...props} onChange={spy} />);

      await delay();
      stdin.write('custom');
      await delay();

      expect(spy).toHaveBeenCalledWith('custom');
      expect(lastFrame()).toMatchSnapshot();
    });
  });

  describe('removing characters', () => {
    it('does nothing if no value', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('\u0008');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can remove characters from the end', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('foo');
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write('\u0008');
      stdin.write('\u0008');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can remove characters from the middle', async () => {
      const { lastFrame, stdin } = render(<Input {...props} />);

      await delay();
      stdin.write('foobar');
      await delay(10);
      stdin.write('\u001B[A'); // key up
      stdin.write('\u001B[C'); // key right
      stdin.write('\u001B[C');
      stdin.write('\u001B[C');
      await delay(10);
      stdin.write('\u0008');
      stdin.write('\u007F');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('renders value and calls `onChange`', async () => {
      const spy = jest.fn();
      const { lastFrame, stdin } = render(<Input {...props} onChange={spy} />);

      await delay();
      stdin.write('custom');
      await delay(10);
      stdin.write('\u0008');
      await delay(10);
      stdin.write('\u0008');
      await delay();

      expect(spy).toHaveBeenCalledWith('cust');
      expect(lastFrame()).toMatchSnapshot();
    });
  });
});
