import React from 'react';
import { render } from 'ink-testing-library';
import { Select, SelectProps } from '../../src/components/Select';
import { KEYS, options, optionsWithoutDivider } from '../helpers';

describe('Select', () => {
  const props: SelectProps<string> = {
    label: 'Favorite color?',
    options: [],
    onSubmit() {},
  };

  it('renders label by default', () => {
    const { lastFrame } = render(<Select {...props} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders options using strings', () => {
    const { lastFrame } = render(
      <Select {...props} options={optionsWithoutDivider.map((o) => o.value)} />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders options using options', () => {
    const { lastFrame } = render(<Select {...props} options={optionsWithoutDivider} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders options and dividers using strings', () => {
    const { lastFrame } = render(
      <Select {...props} options={options.map((o) => ('divider' in o ? o : o.value))} />,
    );

    expect(lastFrame()).toMatchSnapshot();
  });

  it('renders options and dividers using options', () => {
    const { lastFrame } = render(<Select {...props} options={options} />);

    expect(lastFrame()).toMatchSnapshot();
  });

  describe('limit', () => {
    describe('cycle scroll', () => {
      it('truncates list (odd)', () => {
        const { lastFrame } = render(
          <Select {...props} options={options} limit={5} scrollType="cycle" />,
        );

        expect(lastFrame()).toMatchSnapshot();
      });

      it('loops around when hitting an edge (odd)', async () => {
        const { lastFrame, stdin } = render(
          <Select {...props} options={options} limit={5} scrollType="cycle" />,
        );

        await delay();
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });

      it('truncates list (even)', () => {
        const { lastFrame } = render(
          <Select {...props} options={options} limit={6} scrollType="cycle" />,
        );

        expect(lastFrame()).toMatchSnapshot();
      });

      it('loops around when hitting an edge (even)', async () => {
        const { lastFrame, stdin } = render(
          <Select {...props} options={options} limit={6} scrollType="cycle" />,
        );

        await delay();
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        stdin.write(KEYS.up);
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });
    });

    describe('overflow scroll', () => {
      it('truncates list (odd)', () => {
        const { lastFrame } = render(
          <Select {...props} options={options} limit={5} scrollType="overflow" />,
        );

        expect(lastFrame()).toMatchSnapshot();
      });

      it('displays correct before/after more numbers (odd)', async () => {
        const { lastFrame, stdin } = render(
          <Select {...props} options={options} limit={5} scrollType="overflow" />,
        );

        await delay();
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });

      it('truncates list (even)', () => {
        const { lastFrame } = render(
          <Select {...props} options={options} limit={6} scrollType="overflow" />,
        );

        expect(lastFrame()).toMatchSnapshot();
      });

      it('displays correct before/after more numbers (even)', async () => {
        const { lastFrame, stdin } = render(
          <Select {...props} options={options} limit={6} scrollType="overflow" />,
        );

        await delay();
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        stdin.write(KEYS.down);
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });
    });
  });

  describe('dividers', () => {
    describe('displays at the beginning', () => {
      const beginningDividerOptions = [{ divider: true }, 'one', 'two', 'three'];

      it('renders divider first and highlights first non-divider option', () => {
        const { lastFrame } = render(<Select {...props} options={beginningDividerOptions} />);

        expect(lastFrame()).toMatchSnapshot();
      });

      it('can cycle backwards past divider', async () => {
        const { lastFrame, stdin } = render(
          <Select {...props} options={beginningDividerOptions} />,
        );

        await delay();
        stdin.write(KEYS.up);
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });
    });

    describe('displays at the end', () => {
      const endDividerOptions = ['one', 'two', 'three', { divider: true }];

      it('renders divider last and highlights first non-divider option', () => {
        const { lastFrame } = render(<Select {...props} options={endDividerOptions} />);

        expect(lastFrame()).toMatchSnapshot();
      });

      it('can cycle forwards past divider', async () => {
        const { lastFrame, stdin } = render(<Select {...props} options={endDividerOptions} />);

        await delay();
        stdin.write(KEYS.down); // 2
        stdin.write(KEYS.down); // 3
        stdin.write(KEYS.down); // 1
        stdin.write(KEYS.down); // 2
        await delay();

        expect(lastFrame()).toMatchSnapshot();
      });
    });

    it('skips dividers while cycling until a value is found', async () => {
      const { lastFrame, stdin } = render(
        <Select
          {...props}
          options={[
            'one',
            { divider: true },
            { divider: true },
            { divider: true },
            { divider: true },
            'two',
          ]}
        />,
      );

      await delay();
      stdin.write(KEYS.down);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });
  });

  describe('navigation', () => {
    const navOptions = ['one', 'two', 'three'];

    it('displays info color when highlighted', () => {
      const { lastFrame } = render(<Select {...props} options={navOptions} />);

      expect(lastFrame()).toMatchSnapshot();
    });

    it('displays notice color when selected', async () => {
      const { lastFrame, stdin } = render(<Select {...props} options={navOptions} />);

      await delay();
      stdin.write(KEYS.return);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can cycle forwards', async () => {
      const { lastFrame, stdin } = render(<Select {...props} options={navOptions} />);

      await delay();
      stdin.write(KEYS.down);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can cycle backwards', async () => {
      const { lastFrame, stdin } = render(<Select {...props} options={navOptions} />);

      await delay();
      stdin.write(KEYS.up);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });

    it('can jump between last and first', async () => {
      const { lastFrame, stdin } = render(<Select {...props} options={navOptions} />);

      await delay();
      stdin.write(KEYS.right);
      await delay();

      expect(lastFrame()).toMatchSnapshot();

      stdin.write(KEYS.left);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
    });
  });

  describe('selection', () => {
    it('does nothing when hitting space bar', async () => {
      const spy = jest.fn();
      const { lastFrame, stdin } = render(
        <Select {...props} limit={5} options={options} onSubmit={spy} />,
      );

      await delay();
      stdin.write(' ');
      await delay();

      expect(lastFrame()).toMatchSnapshot();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls `onSubmit` with selected value when hitting enter', async () => {
      const spy = jest.fn();
      const { lastFrame, stdin } = render(
        <Select {...props} limit={5} options={options} onSubmit={spy} />,
      );

      await delay();
      stdin.write(KEYS.return);
      await delay();

      expect(lastFrame()).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('black');
    });
  });
});
