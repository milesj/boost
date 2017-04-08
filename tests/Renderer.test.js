import Renderer from '../src/Renderer';

jest.mock('log-update', () => {
  const logUpdate = jest.fn();
  logUpdate.clear = jest.fn();
  logUpdate.done = jest.fn();

  return logUpdate;
});

describe('Renderer', () => {
  let renderer;

  beforeEach(() => {
    renderer = new Renderer(() => []);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('reset()', () => {
    it('clears the output', () => {
      renderer.reset();

      expect(renderer.log.clear).toBeCalled();
    });
  });

  describe('start()', () => {
    it('triggers a render', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.start();
      jest.runTimersToTime(100);

      expect(spy).toBeCalled();
      expect(renderer.log).toBeCalledWith('');
    });

    it('only triggers one render at a time', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.start();
      renderer.start();
      renderer.start();
      jest.runTimersToTime(100);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop()', () => {
    it('triggers a render', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.stop();

      expect(spy).toBeCalled();
      expect(renderer.log).toBeCalledWith('');
    });

    it('closes the stream', () => {
      renderer.stop();

      expect(renderer.log.done).toBeCalled();
    });
  });
});
