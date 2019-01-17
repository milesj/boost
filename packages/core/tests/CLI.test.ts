import { mockTool } from '@boost/test-utils';
import CLI from '../src/CLI';

describe('CLI', () => {
  describe('registerGlobalOptions()', () => {
    it('registers multiple options', () => {
      const app: any = {};
      const spy = jest.fn().mockReturnValue(app);

      app.option = spy;

      CLI.registerGlobalOptions(app, mockTool());

      expect(spy).toHaveBeenCalledTimes(6);
    });
  });
});
