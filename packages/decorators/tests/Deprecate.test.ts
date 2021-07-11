import { Deprecate } from '../src';

describe('@Deprecate', () => {
	let spy: jest.SpyInstance;

	beforeEach(() => {
		spy = jest.spyOn(console, 'debug').mockImplementation();
	});

	afterEach(() => {
		spy.mockRestore();
	});

	it('marks a class as deprecated', () => {
		@Deprecate()
		class Test {}

		expect(spy).toHaveBeenCalledWith('Class `Test` has been deprecated.');
	});

	it('marks a class as deprecated with a custom message', () => {
		@Deprecate('Use something else!')
		class Test {}

		expect(spy).toHaveBeenCalledWith('Use something else!');
	});

	it('marks a method as deprecated', () => {
		class Test {
			@Deprecate()
			static staticMethod() {}

			@Deprecate()
			instMethod() {}
		}

		expect(spy).toHaveBeenCalledWith('Method `Test.staticMethod()` has been deprecated.');
		expect(spy).toHaveBeenCalledWith('Method `Test#instMethod()` has been deprecated.');
	});

	it('marks a method as deprecated with a custom message', () => {
		class Test {
			@Deprecate('Use another static')
			static staticMethod() {}

			@Deprecate('Use another instance')
			instMethod() {}
		}

		expect(spy).toHaveBeenCalledWith('Use another static');
		expect(spy).toHaveBeenCalledWith('Use another instance');
	});

	it('marks a property as deprecated', () => {
		class Test {
			@Deprecate()
			static staticProp = 123;

			@Deprecate()
			instProp = 'abc';
		}

		expect(spy).toHaveBeenCalledWith('Property `Test.staticProp` has been deprecated.');
		expect(spy).toHaveBeenCalledWith('Property `Test#instProp` has been deprecated.');
	});

	it('marks a property as deprecated with a custom message', () => {
		class Test {
			@Deprecate('Use another static')
			static staticProp = 123;

			@Deprecate('Use another instance')
			instProp = 'abc';
		}

		expect(spy).toHaveBeenCalledWith('Use another static');
		expect(spy).toHaveBeenCalledWith('Use another instance');
	});
});
