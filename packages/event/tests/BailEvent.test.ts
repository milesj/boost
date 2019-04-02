import BailEvent from '../src/BailEvent';

describe('BailEvent', () => {
  let event: BailEvent<[string, number]>;

  beforeEach(() => {
    event = new BailEvent('bail.test');
  });

  it('executes listeners in order', () => {
    let output = '';

    event.listen(value => {
      output += value;
      output += 'B';
    });
    event.listen(() => {
      output += 'C';
    });
    event.listen(() => {
      output += 'D';
    });

    const result = event.emit(['A', 0]);

    expect(result).toBe(false);
    expect(output).toBe('ABCD');
  });

  it('executes listeners based on scope', () => {
    let output = '';

    event.listen(() => {
      output += 'A';
    }, 'foo');
    event.listen(() => {
      output += 'B';
    }, 'bar');
    event.listen(() => {
      output += 'C';
    }, 'baz');

    const result = event.emit(['A', 0], 'bar');

    expect(result).toBe(false);
    expect(output).toBe('B');
  });

  it('bails the loop if a listener returns false', () => {
    let count = 0;

    event.listen(() => {
      count += 1;
    });
    event.listen(() => {
      count += 1;

      return false;
    });
    event.listen(() => {
      count += 1;
    });

    const result = event.emit(['', 0]);

    expect(result).toBe(true);
    expect(count).toBe(2);
  });

  it('doesnt bail the loop if a listener returns true', () => {
    let count = 0;

    event.listen((string, number) => {
      count += number;
      count += 1;
    });
    event.listen(() => {
      count += 1;

      return true;
    });
    event.listen(() => {
      count += 1;
    });

    const result = event.emit(['', 1]);

    expect(result).toBe(false);
    expect(count).toBe(4);
  });
});
