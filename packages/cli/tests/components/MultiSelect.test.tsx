import React from 'react';
import { render } from 'ink-testing-library';
import { MultiSelect, MultiSelectProps } from '../../src/components/MultiSelect';
import { KEYS, options, optionsWithoutDivider } from '../helpers';

describe('MultiSelect', () => {
	const props: MultiSelectProps<string> = {
		label: 'Favorite color?',
		options: [],
		onSubmit() {},
	};

	it('renders label by default', () => {
		const { lastFrame } = render(<MultiSelect {...props} />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders options using strings', () => {
		const { lastFrame } = render(
			<MultiSelect {...props} options={optionsWithoutDivider.map((o) => o.value)} />,
		);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders options using options', () => {
		const { lastFrame } = render(<MultiSelect {...props} options={optionsWithoutDivider} />);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders options and dividers using strings', () => {
		const { lastFrame } = render(
			<MultiSelect {...props} options={options.map((o) => ('divider' in o ? o : o.value))} />,
		);

		expect(lastFrame()).toMatchSnapshot();
	});

	it('renders options and dividers using options', () => {
		const { lastFrame } = render(<MultiSelect {...props} options={options} />);

		expect(lastFrame()).toMatchSnapshot();
	});

	describe('dividers', () => {
		describe('displays at the beginning', () => {
			const beginningDividerOptions = [{ divider: true }, 'one', 'two', 'three'];

			it('renders divider first and highlights first non-divider option', () => {
				const { lastFrame } = render(<MultiSelect {...props} options={beginningDividerOptions} />);

				expect(lastFrame()).toMatchSnapshot();
			});

			it('can cycle backwards past divider', async () => {
				const { lastFrame, stdin } = render(
					<MultiSelect {...props} options={beginningDividerOptions} />,
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
				const { lastFrame } = render(<MultiSelect {...props} options={endDividerOptions} />);

				expect(lastFrame()).toMatchSnapshot();
			});

			it('can cycle forwards past divider', async () => {
				const { lastFrame, stdin } = render(<MultiSelect {...props} options={endDividerOptions} />);

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
				<MultiSelect
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
			const { lastFrame } = render(<MultiSelect {...props} options={navOptions} />);

			expect(lastFrame()).toMatchSnapshot();
		});

		it('displays notice color when selected', async () => {
			const { lastFrame, stdin } = render(<MultiSelect {...props} options={navOptions} />);

			await delay();
			stdin.write(' ');
			stdin.write(KEYS.down);
			await delay();

			expect(lastFrame()).toMatchSnapshot();
		});

		it('can cycle forwards', async () => {
			const { lastFrame, stdin } = render(<MultiSelect {...props} options={navOptions} />);

			await delay();
			stdin.write(KEYS.down);
			await delay();

			expect(lastFrame()).toMatchSnapshot();
		});

		it('can cycle backwards', async () => {
			const { lastFrame, stdin } = render(<MultiSelect {...props} options={navOptions} />);

			await delay();
			stdin.write(KEYS.up);
			await delay();

			expect(lastFrame()).toMatchSnapshot();
		});

		it('can jump between last and first', async () => {
			const { lastFrame, stdin } = render(<MultiSelect {...props} options={navOptions} />);

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
		it('selects and displays a value when hitting space bar', async () => {
			const spy = jest.fn();
			const { lastFrame, stdin } = render(
				<MultiSelect {...props} limit={5} options={options} onSubmit={spy} />,
			);

			await delay();
			stdin.write(' ');
			await delay();

			expect(lastFrame()).toMatchSnapshot();
			expect(spy).not.toHaveBeenCalled();
		});

		it('calls `onChange` when selecting values', async () => {
			const spy = jest.fn();
			const { stdin } = render(
				<MultiSelect {...props} limit={5} options={options} onChange={spy} />,
			);

			await delay();
			stdin.write(' ');
			await delay();

			expect(spy).toHaveBeenCalledWith(['black']);

			stdin.write(KEYS.down);
			await delay(10);
			stdin.write(KEYS.down);
			await delay(10);
			stdin.write(' ');
			await delay();

			expect(spy).toHaveBeenCalledWith(['black', 'brown']);

			stdin.write(KEYS.down);
			await delay(10);
			stdin.write(KEYS.down);
			await delay(10);
			stdin.write(' ');
			await delay();

			expect(spy).toHaveBeenCalledWith(['black', 'brown', 'gray']);
		});

		it('can unselect a value when hitting space bar again', async () => {
			const spy = jest.fn();
			const { stdin } = render(
				<MultiSelect {...props} limit={5} options={options} onChange={spy} />,
			);

			await delay();
			stdin.write(' ');
			await delay();

			expect(spy).toHaveBeenCalledWith(['black']);

			stdin.write(' ');
			await delay();

			expect(spy).toHaveBeenCalledWith([]);
		});

		it('calls `onSubmit` with selected values when hitting enter', async () => {
			const spy = jest.fn();
			const { lastFrame, stdin } = render(
				<MultiSelect {...props} limit={5} options={options} onSubmit={spy} />,
			);

			await delay();
			stdin.write(' ');
			stdin.write(KEYS.return);
			await delay();

			expect(lastFrame()).toMatchSnapshot();
			expect(spy).toHaveBeenCalledWith(['black']);
		});

		it('doesnt call `onSubmit` if validation fails', async () => {
			const spy = jest.fn();
			const { lastFrame, stdin } = render(
				<MultiSelect
					{...props}
					limit={5}
					options={options}
					onSubmit={spy}
					validate={() => {
						throw new Error('Failed validation');
					}}
				/>,
			);

			await delay();
			stdin.write(KEYS.return);
			await delay();

			expect(lastFrame()).toMatchSnapshot();
			expect(spy).not.toHaveBeenCalled();
		});
	});
});
