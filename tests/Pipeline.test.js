import Pipeline from '../src/Pipeline';
import Routine from '../src/Routine';
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

  it('closes console connection once ran', async () => {
    const pipeline = new Pipeline('boost', config);
    const spy = jest.spyOn(pipeline.console, 'close');

    await pipeline.run();

    expect(spy).toBeCalled();
  });

  it('closes console connection if an error occurs', async () => {
    class FailureRoutine extends Routine {
      execute() {
        throw new Error('Oops');
      }
    }

    const pipeline = new Pipeline('boost', config);
    const spy = jest.spyOn(pipeline.console, 'close');

    try {
      await pipeline.pipe(new FailureRoutine('fail')).run();
    } catch (error) {
      expect(error).toEqual(new Error('Oops'));
    }

    expect(spy).toBeCalled();
  });
});
