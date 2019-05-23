/* eslint-disable no-magic-numbers */

import fs from 'fs';
import os from 'os';
import execa from 'execa';

function run(command: string): string {
  return String(execa.shellSync(command).stdout);
}

function resolveHome(path: string): string {
  return (path || '').replace(process.env.HOME!, '~');
}

function extractVersion(value: string): string {
  const match = (value || '').match(/\d+\.\d+\.\d+([.-a-z0-9])?/u);

  return match ? match[0] : '';
}

export default class CrashReporter {
  contents: string = '';

  /**
   * Add a label with a value, or multiple values, to the last added section.
   */
  add(label: string, ...messages: (string | number)[]) {
    this.contents += `${label}:\n`;

    messages.forEach(message => {
      this.contents += `  ${message}\n`;
    });
  }

  /**
   * Start a new section with a title.
   */
  addSection(title: string): this {
    this.contents += `\n\n${title.toUpperCase()}\n`;
    this.contents += `${'='.repeat(title.length)}\n\n`;

    return this;
  }

  /**
   * Report Node.js related binary versions and paths.
   */
  reportBinaries(): this {
    this.addSection('Binaries');

    const bins = {
      node: 'Node',
      npm: 'NPM',
      yarn: 'Yarn',
    };

    Object.keys(bins).forEach(bin => {
      try {
        this.add(
          bins[bin as keyof typeof bins],
          extractVersion(run(`${bin} --version`)),
          resolveHome(run(`which ${bin}`)),
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

    keys.forEach(key => {
      this.add(key, process.env[key]!);
    });

    return this;
  }

  /**
   * Report common programming language versions and paths
   */
  reportLanguages(): this {
    this.addSection('Languages');

    const languages = {
      bash: 'Bash',
      go: 'Go',
      javac: 'Java',
      perl: 'Perl',
      php: 'PHP',
      python: 'python',
      ruby: 'Ruby',
      rustup: 'Rust',
    };

    Object.keys(languages).forEach(bin => {
      let version;

      try {
        version = extractVersion(run(`${bin} --version`));

        if (!version) {
          version = extractVersion(run(`${bin} version`));
        }
      } catch {
        // Ignore
      }

      if (version) {
        this.add(
          languages[bin as keyof typeof languages],
          version,
          resolveHome(run(`which ${bin}`)),
        );
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
    this.add('ARGV', process.argv.join('\n  '));

    return this;
  }

  /**
   * Report the stack trace for a defined `Error`.
   */
  reportStackTrace(error: Error): this {
    this.addSection('Stack Trace');
    this.contents += error.stack;

    return this;
  }

  /**
   * Report information about the platform and operating system.
   */
  reportSystem(): this {
    this.addSection('System');
    this.add('OS', process.platform);
    this.add('Architecture', process.arch);
    this.add('CPUs', os.cpus().length);
    this.add('Uptime (sec)', process.uptime());
    this.add(
      'Memory usage',
      `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`,
    );

    if (process.platform !== 'win32') {
      this.add('Group ID', process.getgid());
      this.add('User ID', process.getuid());
    }

    return this;
  }

  /**
   * Write the reported content to the defined file path.
   */
  write(filePath: string) {
    fs.writeFileSync(filePath, this.contents.trim(), 'utf8');
  }
}
