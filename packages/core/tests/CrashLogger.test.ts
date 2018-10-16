import fs from 'fs';
import path from 'path';
import CrashLogger from '../src/CrashLogger';
import Tool from '../src/Tool';
import { createTestTool } from './helpers';

jest.mock('fs');

describe('CrashLogger', () => {
  let tool: Tool<any, any>;
  let logger: CrashLogger;

  beforeEach(() => {
    tool = createTestTool();
  });

  it('writes to a log file', () => {
    logger = new CrashLogger(tool);
    logger.log(new Error());

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });

  it('with different parameters', () => {
    tool.config.extends = ['./some/other/file.js'];
    tool.options.scoped = true;

    logger = new CrashLogger(tool);
    logger.log(new Error());

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });
});
