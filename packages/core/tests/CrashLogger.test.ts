import fs from 'fs-extra';
import path from 'path';
import { mockTool } from '@boost/test-utils';
import CrashLogger from '../src/CrashLogger';
import Tool from '../src/Tool';

describe('CrashLogger', () => {
  let tool: Tool<any>;
  let logger: CrashLogger;
  let spy: jest.Mock;

  const oldWrite = fs.writeFileSync.bind(fs);

  beforeEach(() => {
    tool = mockTool();
    logger = new CrashLogger(tool);
    spy = jest.fn();

    fs.writeFileSync = spy;
  });

  afterEach(() => {
    fs.writeFileSync = oldWrite;
  });

  it('writes to a log file', () => {
    logger.log(new Error());

    expect(spy).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });

  it('with different parameters', () => {
    tool.config.extends = ['./some/other/file.js'];
    tool.options.scoped = true;

    logger.log(new Error());

    expect(spy).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });

  it('with console information', () => {
    tool.console.log('Log');
    tool.console.logError('Error');

    logger.log(new Error());

    expect(spy).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });
});
