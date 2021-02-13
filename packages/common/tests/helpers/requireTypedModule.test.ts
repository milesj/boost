import requireTypedModule from '../../src/helpers/requireTypedModule';

describe('requireTypedModule()', () => {
  it('handles default export', () => {
    console.log(__dirname, __filename);
    console.log(require('./__fixtures__/test.js'));
    console.log(requireTypedModule('./__fixtures__/default-export.ts'));
  });
});
