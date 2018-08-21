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

    logger = new CrashLogger(tool);
  });

  it('writes to a log file', () => {
    logger.log(new Error());

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(tool.options.root, 'test-boost-error.log'),
      expect.anything(),
      'utf8',
    );
  });
});
