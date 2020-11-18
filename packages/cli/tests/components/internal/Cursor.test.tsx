import React from 'react';
import { render } from 'ink-testing-library';
import { Cursor } from '../../../src/components/internal/Cursor';

describe('Cursor', () => {
  it('renders value with no cursor if not focused', () => {
    const { lastFrame } = render(<Cursor value="Some string of text" position={0} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor at the start', () => {
    const { lastFrame } = render(<Cursor focused value="Some string of text" position={0} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor at the end', () => {
    const { lastFrame } = render(<Cursor focused value="Some string of text" position={18} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor in the middle', () => {
    const { lastFrame } = render(<Cursor focused value="Some string of text" position={8} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders cursor after value', () => {
    const { lastFrame } = render(<Cursor focused value="Some string of text" position={19} />);

    expect(lastFrame()).toMatchSnapshot();
  });
});
