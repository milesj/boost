import ParallelEvent from '../src/ParallelEvent';

describe('ParallelEvent', () => {
  let event: ParallelEvent<[number]>;

  beforeEach(() => {
    event = new ParallelEvent('parallel.test');
  });

  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it('returns a promise', () => {
    expect(event.emit([0])).toBeInstanceOf(Promise);
  });

  it('executes listeners asynchronously with arguments', async () => {
    const output: number[] = [];

    function getRandom() {
      return Math.round(Math.random() * (500 - 0) + 0);
    }

    event.listen(
      value =>
        new Promise<number>(resolve => {
          setTimeout(() => {
            resolve(value * 2);
          }, getRandom());
        }),
    );
    event.listen(
      value =>
        new Promise<number>(resolve => {
          setTimeout(() => {
            resolve(value * 3);
          }, getRandom());
        }),
    );
    event.listen(
      value =>
        new Promise<number>(resolve => {
          setTimeout(() => {
            resolve(value * 4);
          }, getRandom());
        }),
    );

    await event.emit([1]);

    expect(output).not.toEqual([2, 3, 4]);
  });
});
