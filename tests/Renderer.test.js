import logUpdate from 'log-update'; // mocked
import Renderer from '../src/Renderer';

jest.mock('log-update', () => {
  const render = jest.fn();
  render.clear = jest.fn();
  render.done = jest.fn();

  return render;
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

      expect(logUpdate.clear).toBeCalled();
    });
  });

  describe('start()', () => {
    it('triggers a render', () => {
      const spy = jest.spyOn(renderer, 'render');

      renderer.start();
      jest.runTimersToTime(100);

      expect(spy).toBeCalled();
      expect(logUpdate).toBeCalledWith('');
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
      expect(logUpdate).toBeCalledWith('');
    });

    it('closes the stream', () => {
      renderer.stop();

      expect(logUpdate.done).toBeCalled();
    });
  });
});
