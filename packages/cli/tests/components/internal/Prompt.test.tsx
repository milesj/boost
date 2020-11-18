import React from 'react';
import { Box, Text } from 'ink';
import { render } from 'ink-testing-library';
import { Prompt } from '../../../src/components/internal/Prompt';

// Differs between osx/windows
jest.mock('figures', () => ({
  tick: '^',
  cross: 'x',
}));

// http://ascii-table.com/ansi-escape-sequences-vt-100.php
describe('Prompt', () => {
  it('renders default state', () => {
    const { lastFrame } = render(<Prompt label="Label" value="" />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders content before and after label', () => {
    const { lastFrame } = render(
      <Prompt
        beforeLabel={<Text>Before</Text>}
        label="Label"
        afterLabel={<Text>After</Text>}
        value=""
      />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders content below label', () => {
    const { lastFrame } = render(
      <Prompt label="Label" value="">
        <Box>
          <Text>Foo</Text>
        </Box>
        <Box>
          <Text>Bar</Text>
        </Box>
        <Box>
          <Text>Baz</Text>
        </Box>
      </Prompt>,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders error below label and above content', async () => {
    const { lastFrame, stdin } = render(
      <Prompt
        label="Label"
        value=""
        validate={() => {
          throw new Error('Failed validation');
        }}
      >
        <Box>
          <Text>Foo</Text>
        </Box>
      </Prompt>,
    );

    await delay();
    stdin.write('\r');
    await delay();

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders success after submission', async () => {
    const { lastFrame, stdin } = render(
      <Prompt label="Label" value="">
        <Box>
          <Text>Foo</Text>
        </Box>
      </Prompt>,
    );

    await delay();
    stdin.write('\r');
    await delay();

    expect(lastFrame()).toMatchSnapshot();
  });

  it('calls `onKeyUp` for up arrow', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onKeyUp={spy} />);

    await delay();
    stdin.write('\u001B[A');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onKeyDown` for down arrow', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onKeyDown={spy} />);

    await delay();
    stdin.write('\u001B[B');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onKeyRight` for right arrow', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onKeyRight={spy} />);

    await delay();
    stdin.write('\u001B[C');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onKeyLeft` for left arrow', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onKeyLeft={spy} />);

    await delay();
    stdin.write('\u001B[D');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onPageUp` for page up', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onPageUp={spy} />);

    await delay();
    stdin.write('\u001B[5~');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onPageDown` for page down', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onPageDown={spy} />);

    await delay();
    stdin.write('\u001B[6~');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onTab` for tab', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onTab={spy} />);

    await delay();
    stdin.write('\t');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onBackspace` for backspace', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onBackspace={spy} />);

    await delay();
    stdin.write('\u0008');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onDelete` for delete', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onDelete={spy} />);

    await delay();
    stdin.write('\u007F');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onReturn` for return/enter', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onReturn={spy} />);

    await delay();
    stdin.write('\r');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onEscape` for escape', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onEscape={spy} />);

    await delay();
    stdin.write('\u001B');
    await delay();

    expect(spy).toHaveBeenCalled();
  });

  it('calls `onInput` for standard characters', async () => {
    const spy = jest.fn();
    const { stdin } = render(<Prompt label="Label" value="" onInput={spy} />);

    await delay();
    stdin.write('a');
    await delay();

    expect(spy).toHaveBeenCalledWith('a', expect.any(Object));
  });
});
