import Pipeline from '../src/Pipeline';
import Console from '../src/Console';

jest.mock('readline');

describe('Pipeline', () => {
  const config = {
    foo: 'bar',
    bar: { qux: 123 },
  };

  it('inherits both normal config and global config', () => {
    const pipeline = new Pipeline('boost', config);

    expect(pipeline.config).toEqual(config);
    expect(pipeline.globalConfig).toEqual(config);
  });

  it('instantiates a console', () => {
    const pipeline = new Pipeline('boost', config);

    expect(pipeline.console).toBeInstanceOf(Console);
  });
});
