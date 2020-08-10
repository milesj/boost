import { Path } from '@boost/common';
import loadTS from '../../src/loaders/ts';

describe('ts()', () => {
  afterEach(() => {
    delete process.env.BOOSTJS_CONFIG_TEST_IGNORE_BABEL;
    delete process.env.BOOSTJS_CONFIG_TEST_IGNORE_TYPESCRIPT;
  });

  const path = new Path(__dirname, '../__fixtures__/ts-file-type.ts');

  it('transforms with `typescript`', async () => {
    process.env.BOOSTJS_CONFIG_TEST_IGNORE_BABEL = 'true';

    const result = await loadTS(path);

    expect(result).toEqual({ debug: true });
  });

  it('transforms with `@babel/core`', async () => {
    process.env.BOOSTJS_CONFIG_TEST_IGNORE_TYPESCRIPT = 'true';

    const result = await loadTS(path);

    expect(result).toEqual({ debug: true });
  });

  it('errors if neither packages are available', async () => {
    process.env.BOOSTJS_CONFIG_TEST_IGNORE_BABEL = 'true';
    process.env.BOOSTJS_CONFIG_TEST_IGNORE_TYPESCRIPT = 'true';

    expect.assertions(1);

    try {
      await loadTS(path);
    } catch (error) {
      expect(error).toEqual(new Error(`Failed to transform source code for "${path}".`));
    }
  });
});
