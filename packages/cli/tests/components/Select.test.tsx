import React from 'react';
import { render } from 'ink-testing-library';
import { Select, SelectOption, SelectProps } from '../../src/components/Select';
import { KEYS } from '../helpers';

describe('Select', () => {
  const props: SelectProps<string> = {
    label: 'Favorite color?',
    options: [],
    onSubmit() {},
  };

  const options: SelectOption<string>[] = [
    { label: 'B', divider: true },
    { label: 'Black', value: 'black' },
    { label: 'Blue', value: 'blue' },
    { label: 'Brown', value: 'brown' },
    { label: 'C', divider: true },
    { label: 'Cyan', value: 'cyan' },
    { label: 'G', divider: true },
    { label: 'Gray', value: 'gray' },
    { label: 'Green', value: 'green' },
    { label: 'O', divider: true },
    { label: 'Orange', value: 'orange' },
    { label: 'P', divider: true },
    { label: 'Purple', value: 'purple' },
    { label: 'R', divider: true },
    { label: 'Red', value: 'red' },
    { label: 'W', divider: true },
    { label: 'White', value: 'white' },
    { label: 'Y', divider: true },
    { label: 'Yellow', value: 'yellow' },
  ];

  const optionsWithoutDivider = options.filter((o) => !('divider' in o)) as {
    label: string;
    value: string;
  }[];

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
      it('renders correctly', () => {});

      it('can cycle backwards past divider', () => {});

      it('will jump to first non-divider', () => {});
    });

    describe('displays at the end', () => {
      it('renders correctly', () => {});

      it('can cycle forwards past divider', () => {});

      it('will jump to last non-divider', () => {});
    });

    it('skips dividers while cycling until a value is found', () => {});
  });

  describe('navigation', () => {
    it('displays info color when highlighted', () => {});

    it('displays notice color when selected', () => {});

    it('can cycle forwards', () => {});

    it('can cycle backwards', () => {});

    it('can jump to first', () => {});

    it('can jump to last', () => {});
  });

  describe('selection', () => {
    describe('single value', () => {
      it('does nothing when hitting space bar', () => {});

      it('calls `onSubmit` with selected value when hitting enter', () => {});

      it('doesnt call `onSubmit` if validation fails', () => {});
    });

    describe('multiple values', () => {
      it('selects and displays a value when hitting space bar', () => {});

      it('can unselect a value when hitting space bar again', () => {});

      it('calls `onSubmit` with selected values when hitting enter', () => {});

      it('doesnt call `onSubmit` if validation fails', () => {});
    });
  });
});
