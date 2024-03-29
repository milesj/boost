import fs from 'node:fs';
import path from 'node:path';
import { execaSync } from 'execa';
import glob from 'fast-glob';
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	type MockInstance,
	vi,
} from 'vitest';
import { CrashReporter } from '../src/CrashReporter';

vi.mock('execa');
vi.mock('fast-glob');

describe('CrashReporter', () => {
	let reporter: CrashReporter;
	let writeSpy: MockInstance;

	beforeEach(() => {
		(execaSync as Mock).mockImplementation((command, args = []) => {
			// Test the fallback to `version`
			if (command === 'php' && args[0] === '--version') {
				return {
					stderr: '',
					stdout: '',
				};
			}

			return {
				stderr: '',
				stdout: command.includes('where') ? `/${args.join(' ')}` : '0.0.0',
			};
		});

		reporter = new CrashReporter();
		writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(vi.fn());
	});

	afterEach(() => {
		writeSpy.mockRestore();
	});

	it('adds content and sections', () => {
		reporter.add('Label', 'Value');

		expect(reporter.contents).toMatchSnapshot();

		reporter.addSection('Section 1');
		reporter.add('Foo', 'Value');
		reporter.add('Bar', 'Value 1', 'Value 2');

		expect(reporter.contents).toMatchSnapshot();

		reporter.addSection('Section 2');
		reporter.add('Baz', 123);

		expect(reporter.contents).toMatchSnapshot();
	});

	it('writes content to the defined file path', () => {
		reporter.addSection('Section');
		reporter.add('Label', 'Value');
		reporter.write('./some.log');

		expect(writeSpy).toHaveBeenCalledWith(
			'./some.log',
			`SECTION
=======

Label:
  Value`,
			'utf8',
		);
	});

	it('reports binaries', () => {
		reporter.reportBinaries();

		expect(reporter.contents).toMatchSnapshot();
	});

	it('reports environment variables', () => {
		const oldVars = process.env;

		process.env = {
			FOO: 'foo',
			BAR: 'bar',
			BAZ: 'baz',
		};

		reporter.reportEnvVars();

		expect(reporter.contents).toMatchSnapshot();

		process.env = oldVars;
	});

	it('reports languages', () => {
		reporter.reportLanguages();

		expect(reporter.contents).toContain('Ruby');
		expect(reporter.contents).toContain('0.0.0 - /php');
	});

	it('reports current process', () => {
		reporter.reportProcess();

		expect(reporter.contents).toContain('ID');
		expect(reporter.contents).toContain('CWD');
	});

	it('reports a stack trace', () => {
		reporter.reportStackTrace(new Error('Oops'));

		expect(reporter.contents).toContain('Error: Oops');
	});

	it('reports current system', () => {
		reporter.reportSystem();

		expect(reporter.contents).toContain('OS');
		expect(reporter.contents).toContain('CPUs');
	});

	it('reports package versions', () => {
		vi.spyOn(glob, 'sync').mockImplementationOnce(() => [
			path.join(process.cwd(), '../../node_modules/path-exists'),
			path.join(process.cwd(), '../../node_modules/path-is-absolute'),
		]);

		reporter.reportPackageVersions('path-*');

		expect(reporter.contents).toMatchSnapshot();
	});

	it('reports package versions (scoped)', () => {
		vi.spyOn(glob, 'sync').mockImplementationOnce(() => [
			path.join(process.cwd(), '../../node_modules/@moonrepo/dev'),
		]);

		reporter.reportPackageVersions('@moonrepo/*', 'moon');

		expect(reporter.contents).toMatchSnapshot();
	});
});
