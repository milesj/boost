/* eslint-disable no-magic-numbers */

import fs from 'fs';
import os from 'os';
import path from 'path';
import execa from 'execa';
import glob from 'fast-glob';
import { FilePath, PackageStructure, PortablePath, toArray } from '@boost/common';
import { debug } from './debug';

function run(command: string, args: string[]): string {
	let cmd = command;

	if (command === 'where' && os.platform() === 'win32') {
		cmd += '.exe';
	}

	return String(execa.sync(cmd, args, { preferLocal: true }).stdout);
}

function resolveHome(filePath: FilePath): string {
	return filePath.replace(process.env.HOME!, '~');
}

function extractVersion(value: string): string {
	const match = value.match(/\d+\.\d+\.\d+([.-a-z0-9])?/u);

	return match ? match[0] : '';
}

export class CrashReporter {
	contents: string = '';

	/**
	 * Add a label with a value, or multiple values, to the last added section.
	 */
	add(label: string, ...messages: (PortablePath | number | string)[]): this {
		this.contents += `${label}:\n`;
		this.contents += `  ${messages.map(String).join(' - ')}\n`;

		return this;
	}

	/**
	 * Start a new section with a title.
	 */
	addSection(title: string): this {
		this.contents += `\n${title.toUpperCase()}\n`;
		this.contents += `${'='.repeat(title.length)}\n\n`;

		debug('Reporting crash with %s', title);

		return this;
	}

	/**
	 * Report Node.js related binary versions and paths.
	 */
	reportBinaries(): this {
		this.addSection('Binaries');

		const bins = {
			node: 'Node',
			npm: 'npm',
			yarn: 'Yarn',
		};

		Object.keys(bins).forEach((bin) => {
			try {
				this.add(
					bins[bin as keyof typeof bins],
					extractVersion(run(bin, ['--version'])),
					resolveHome(run('where', [bin])),
				);
			} catch {
				// Ignore
			}
		});

		return this;
	}

	/**
	 * Report all environment variables.
	 */
	reportEnvVars(): this {
		this.addSection('Environment');

		const keys = Object.keys(process.env).sort();

		keys.forEach((key) => {
			this.add(key, process.env[key]!);
		});

		return this;
	}

	/**
	 * Report common programming language versions and paths
	 */
	reportLanguages(): this {
		this.addSection('Languages');

		const languages: Record<string, string> = {
			bash: 'Bash',
			go: 'Go',
			javac: 'Java',
			perl: 'Perl',
			php: 'PHP',
			python: 'Python',
			ruby: 'Ruby',
			rustup: 'Rust',
		};

		// When running on OSX and Java is not installed,
		// OSX will interrupt the process with a prompt to install Java.
		// This is super annoying, so let's not disrupt consumers.
		// istanbul ignore next
		if (os.platform() === 'darwin') {
			delete languages.javac;
		}

		Object.keys(languages).forEach((bin) => {
			let version;

			try {
				version = extractVersion(run(bin, ['--version']));

				if (!version) {
					version = extractVersion(run(bin, ['version']));
				}

				if (version) {
					this.add(languages[bin], version, resolveHome(run('where', [bin])));
				}
			} catch {
				// Ignore
			}
		});

		return this;
	}

	/**
	 * Report information about the current `process`.
	 */
	reportProcess(): this {
		this.addSection('Process');
		this.add('ID', process.pid);
		this.add('Title', process.title);
		this.add('Timestamp', new Date().toISOString());
		this.add('CWD', process.cwd());
		this.add('ARGV', process.argv.map((v) => `- ${v}`).join('\n  '));

		return this;
	}

	/**
	 * Report the stack trace for a defined `Error`.
	 */
	reportStackTrace(error: Error): this {
		this.addSection('Stack Trace');
		this.contents += String(error.stack);
		this.contents += '\n';

		return this;
	}

	/**
	 * Report information about the platform and operating system.
	 */
	reportSystem(): this {
		this.addSection('System');
		this.add('OS', os.platform());
		this.add('Architecture', os.arch());
		this.add('CPUs', os.cpus().length);
		this.add('Uptime (sec)', os.uptime());
		this.add(
			'Memory usage',
			`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
		);

		// istanbul ignore next
		if (process.platform !== 'win32') {
			this.add('Group ID', process.getgid());
			this.add('User ID', process.getuid());
		}

		return this;
	}

	/**
	 * Report npm package versions for all that match the defined pattern.
	 * Only searches in the root node modules folder and _will not_ work with PnP.
	 */
	reportPackageVersions(patterns: string[] | string, title: string = 'Packages'): this {
		this.addSection(title);

		const map = new Map<string, string>();

		glob
			.sync(
				toArray(patterns).map((pattern) => path.join('./node_modules', pattern)),
				{
					absolute: true,
					onlyDirectories: true,
					onlyFiles: false,
				},
			)
			.forEach((pkgPath) => {
				const pkg = require(path.join(pkgPath, 'package.json')) as PackageStructure;

				map.set(pkg.name, pkg.version);
			});

		map.forEach((version, name) => {
			this.add(name, version);
		});

		return this;
	}

	/**
	 * Write the reported content to the defined file path.
	 */
	write(filePath: PortablePath): this {
		fs.writeFileSync(String(filePath), this.contents.trim(), 'utf8');

		return this;
	}
}
