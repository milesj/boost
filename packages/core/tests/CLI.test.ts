import CLI from '../src/CLI';
import { createTestTool } from './helpers';

describe('CLI', () => {
  describe('registerGlobalOptions()', () => {
    it('registers multiple options', () => {
      const app: any = {};
      const spy = jest.fn().mockReturnValue(app);
      app.option = spy;

      CLI.registerGlobalOptions(app, createTestTool());

      expect(spy).toHaveBeenCalledTimes(6);
    });
  });
});
