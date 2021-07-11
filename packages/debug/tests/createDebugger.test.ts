import debug from 'debug';
import { color } from '@boost/internal';
import { createDebugger } from '../src/createDebugger';
import { Debugger } from '../src/types';

describe('createDebugger()', () => {
	let errSpy: jest.SpyInstance;
	let debugFunc: Debugger;
	let oldDebugEnvVar: string | undefined;

	beforeEach(() => {
		oldDebugEnvVar = process.env.DEBUG;
		debugFunc = createDebugger('debug');

		// Doesn't write unless an env var is set, so force it
		debugFunc.enable();

		errSpy = jest.spyOn(process.stderr, 'write').mockImplementation(jest.fn());
	});

	afterEach(() => {
		errSpy.mockRestore();

		process.env.BOOSTJS_DEBUG_NAMESPACE = '';
		process.env.DEBUG = oldDebugEnvVar;
	});

	it('returns a debug function', () => {
		expect(typeof debugFunc).toBe('function');
	});

	it('inherits a namespace', () => {
		debugFunc = createDebugger('ns');

		expect(debugFunc.namespace).toBe('ns');
	});

	it('inherits app namespace from env var', () => {
		process.env.BOOSTJS_DEBUG_NAMESPACE = 'boost';

		debugFunc = createDebugger('ns');

		expect(debugFunc.namespace).toBe('boost:ns');
	});

	it('inherits multiple namespaces and joins with a `:`', () => {
		debugFunc = createDebugger(['foo', 'bar', 'baz']);

		expect(debugFunc.namespace).toBe('foo:bar:baz');
	});

	it('provides an `enable` function', () => {
		expect(typeof debugFunc.enable).toBe('function');
	});

	it('provides an `invariant` function', () => {
		expect(typeof debugFunc.invariant).toBe('function');
	});

	it('provides an `verbose` function', () => {
		expect(typeof debugFunc.verbose).toBe('function');
	});

	it('writes when called as a function', () => {
		debugFunc('Log!');

		expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('Log!'));
	});

	describe('invariant()', () => {
		it('writes invariant pass message when condition is truthy', () => {
			debugFunc.invariant(true, 'Comparing', 'Pass', 'Fail');

			expect(errSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Comparing: ${color.pass('Pass')}`),
			);
		});

		it('writes invariant fail message when condition is falsy', () => {
			debugFunc.invariant(false, 'Comparing', 'Pass', 'Fail');

			expect(errSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Comparing: ${color.fail('Fail')}`),
			);
		});
	});

	describe('verbose()', () => {
		it('doesnt write verbose logs unless env var is set', () => {
			debugFunc.verbose('Loonnnggg log!');

			expect(errSpy).not.toHaveBeenCalled();
		});

		it('writes verbose logs when env var is set', () => {
			process.env.BOOSTJS_DEBUG_VERBOSE = 'true';

			debugFunc.verbose('Loonnnggg log!');

			expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('Loonnnggg log!'));

			delete process.env.BOOSTJS_DEBUG_VERBOSE;
		});
	});

	describe('enable()', () => {
		it('enables the namespace on `debug`', () => {
			const spy = jest.spyOn(debug, 'enable');

			debugFunc.enable();

			expect(spy).toHaveBeenCalledWith('debug');

			spy.mockRestore();
		});
	});

	describe('disable()', () => {
		it('disables the namespace by modifying the `DEBUG` env var', () => {
			process.env.DEBUG = 'debug';

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('');
		});

		it('supports wildcard namespaces', () => {
			process.env.DEBUG = 'debug:*';

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('');
		});

		it('supports the namespace at the beginning', () => {
			process.env.DEBUG = 'debug,other:*,name';

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('other:*,name');
		});

		it('supports the namespace in the middle', () => {
			process.env.DEBUG = 'other,debug,name:*';

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('other,name:*');
		});

		it('supports the namespace at the end', () => {
			process.env.DEBUG = 'other,name,debug:*';

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('other,name');
		});

		it('does nothing if not set', () => {
			delete process.env.DEBUG;

			debugFunc.disable();

			expect(process.env.DEBUG).toBe('');
		});
	});
});
