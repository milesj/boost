import { requireTypedModule } from '../../src/typescript/requireTypedModule';

describe('requireTypedModule()', () => {
  it('errors if not a .ts file or .tsx file', () => {
    expect(() => {
      requireTypedModule('some-fake-module');
    }).toThrow(
      'Unable to import non-TypeScript file "some-fake-module", use `requireModule` instead.',
    );
  });
});
