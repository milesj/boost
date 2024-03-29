import { describe, expect, it } from 'vitest';
import { type ContextFactory, ParseError, parseInContext, type ParserOptions } from '../src';
import {
	flagConfig,
	numConfigExpanded,
	numsConfig,
	optConfig,
	optsConfigArity,
} from './__fixtures__/options';

describe('parseInContext()', () => {
	interface FooOptions {
		arity: string[];
		flag: boolean;
		opt: string;
	}

	const fooParserOptions: ParserOptions<FooOptions> = {
		commands: ['foo'],
		options: {
			arity: optsConfigArity,
			flag: flagConfig,
			opt: optConfig,
		},
		unknown: true,
	};

	interface BarOptions {
		count: number;
		nums: number[];
	}

	const barParserOptions: ParserOptions<BarOptions> = {
		commands: ['bar'],
		options: {
			count: {
				...numConfigExpanded,
				count: true,
				default: 0,
			},
			nums: numsConfig,
		},
		unknown: true,
	};

	interface BazOptions {
		choice: 'a' | 'b' | 'c';
	}

	const bazParserOptions: ParserOptions<BazOptions> = {
		commands: [],
		options: {
			choice: {
				...optConfig,
				// @ts-expect-error TS not resolving correctly
				choices: ['a', 'b', 'c'],
				default: 'a',
			},
		},
		unknown: true,
	};

	const contextFactory: ContextFactory = (arg, argv) => {
		if (arg === 'foo' || arg === '--unknown-option') {
			return fooParserOptions;
		}
		if (arg === 'bar') {
			return barParserOptions;
		}
		if (arg === 'baz' && argv.includes('--allow')) {
			return bazParserOptions;
		}

		return undefined;
	};

	it('returns different arguments based on context factory', () => {
		const fooResult = parseInContext<FooOptions>(['foo', '-F', '--opt', 'value'], contextFactory);

		expect(fooResult).toEqual({
			command: ['foo'],
			errors: [],
			options: {
				arity: [],
				flag: true,
				opt: 'value',
			},
			params: [],
			rest: [],
			unknown: {},
		});

		const barResult = parseInContext<BarOptions>(
			['bar', '--nums', '1', '2', '-nn', '--nums', '3'],
			contextFactory,
		);

		expect(barResult).toEqual({
			command: ['bar'],
			errors: [],
			options: {
				count: 2,
				nums: [1, 2, 3],
			},
			params: [],
			rest: [],
			unknown: {},
		});
	});

	it('can context match based on options', () => {
		const fooResult = parseInContext<FooOptions>(['--unknown-option'], contextFactory);

		expect(fooResult).toEqual({
			command: [],
			errors: [],
			options: {
				arity: [],
				flag: false,
				opt: '',
			},
			params: [],
			rest: [],
			unknown: {
				unknownOption: '',
			},
		});
	});

	it('can context match using the entire argv list', () => {
		const bazResult = parseInContext<BazOptions>(['baz', '--allow'], contextFactory);

		expect(bazResult).toEqual({
			command: [],
			errors: [],
			options: {
				choice: 'a',
			},
			params: ['baz'],
			rest: [],
			unknown: {
				allow: '',
			},
		});

		expect(() => {
			parseInContext<BazOptions>(['baz', '--deny'], contextFactory);
		}).toThrow('Contextual parser options were not provided.');
	});

	it('errors if factory doesnt return parser options', () => {
		expect(() => {
			parseInContext(['qux', '-F', '--opt', 'value'], contextFactory);
		}).toThrow('Contextual parser options were not provided.');
	});

	it('errors if command is found but doesnt come first', () => {
		const result = parseInContext(['qux', 'foo'], contextFactory);

		expect(result.errors).toEqual([
			new ParseError(
				'Command must be passed as the first non-option, non-param argument. [ARG:COMMAND_NOT_FIRST]',
				'foo',
				1,
			),
		]);
	});
});
