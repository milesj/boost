import fs from 'fs';
import execa from 'execa';
import CrashReporter from '../src/CrashReporter';

jest.mock('execa');

describe('CrashReporter', () => {
  let reporter: CrashReporter;
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    (execa.sync as jest.Mock).mockImplementation((command, args = []) => {
      // Test the fallback to `version`
      if (command === 'php' && args[0] === '--version') {
        return {
          stderr: '',
          stdout: '',
        };
      }

      return {
        stderr: '',
        stdout: command === 'which' ? `/${args.join(' ')}` : '0.0.0',
      };
    });

    reporter = new CrashReporter();
    writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn());
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
    expect(reporter.contents).toContain('at Object');
  });

  it('reports current system', () => {
    reporter.reportSystem();

    expect(reporter.contents).toContain('OS');
    expect(reporter.contents).toContain('CPUs');
  });

  it('reports package versions', () => {
    reporter.reportPackageVersions('path-*');

    expect(reporter.contents).toMatchSnapshot();
  });

  it('reports package versions (scoped)', () => {
    reporter.reportPackageVersions('@beemo/*', 'Beemo');

    expect(reporter.contents).toMatchSnapshot();
  });
});
