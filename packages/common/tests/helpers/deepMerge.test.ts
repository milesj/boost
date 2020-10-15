import deepMerge from '../../src/helpers/deepMerge';

describe('deepMerge()', () => {
  describe('objects', () => {
    it('supports 1 object and creates a new object', () => {
      const base = { foo: 123 };
      const obj = deepMerge(base);

      expect(obj).toEqual({ foo: 123 });
      expect(obj).not.toBe(base);
    });

    it('supports 2 objects and creates a new object', () => {
      const obj = deepMerge({ foo: 123 }, { bar: 'abc' });

      expect(obj).toEqual({ foo: 123, bar: 'abc' });
    });

    it('overwrites previous properties', () => {
      const obj = deepMerge({ foo: 123 }, { foo: 456 });

      expect(obj).toEqual({ foo: 456 });
    });

    it('adds new properties', () => {
      const obj = deepMerge({ foo: 123 }, { bar: 'abc' });

      expect(obj).toEqual({ foo: 123, bar: 'abc' });
    });

    it('supports falsy properties', () => {
      const obj = deepMerge({ foo: 123, baz: undefined }, { bar: null, foo: false });

      expect(obj).toEqual({ foo: false, bar: null, baz: undefined });
    });

    it('merges nested objects and breaks references', () => {
      const base = { foo: { a: 123, b: 'abc' } };
      const obj = deepMerge(base, { foo: { b: 'xyz' } });

      expect(obj).toEqual({ foo: { a: 123, b: 'xyz' } });
      expect(obj.foo).not.toBe(base.foo);
    });

    it('merges nested arrays and breaks references', () => {
      const base = { foo: [123, 'abc'] };
      const obj = deepMerge(base, { foo: [456] });

      expect(obj).toEqual({ foo: [456, 'abc'] });
      expect(obj.foo).not.toBe(base.foo);
    });

    it('merges complex structures (deepmerge)', () => {
      const obj = deepMerge(
        {
          foo: { bar: 3 },
          array: [
            {
              does: 'work',
              too: [1, 2, 3],
            },
          ],
        },
        {
          foo: { baz: 4 },
          quux: 5,
          array: [
            {
              does: 'work',
              too: [4, 5, 6],
            },
            {
              really: 'yes',
            },
          ],
        },
      );

      expect(obj).toEqual({
        foo: {
          bar: 3,
          baz: 4,
        },
        array: [
          {
            does: 'work',
            too: [4, 5, 6],
          },
          {
            really: 'yes',
          },
        ],
        quux: 5,
      });
    });

    it('merges complex structures (deep-extend)', () => {
      const obj = deepMerge(
        {
          a: 1,
          b: 2,
          d: {
            a: 1,
            b: [],
            c: { test1: 123, test2: 321 },
          },
          f: 5,
          g: 123,
          i: 321,
          j: [1, 2],
        },
        {
          b: 3,
          c: 5,
          d: {
            b: { first: 'one', second: 'two' },
            c: { test2: 222 },
          },
          e: { one: 1, two: 2 },
          f: [],
          g: void 0,
          h: /abc/gu,
          i: null,
          j: [3, 4],
        },
      );

      expect(obj).toEqual({
        a: 1,
        b: 3,
        d: { a: 1, b: { first: 'one', second: 'two' }, c: { test1: 123, test2: 222 } },
        f: [],
        g: undefined,
        c: 5,
        e: { one: 1, two: 2 },
        h: /abc/gu,
        i: null,
        j: [3, 4],
      });
    });
  });

  describe('arrays', () => {
    it('supports 1 array and creates a new array', () => {
      const base = [123];
      const obj = deepMerge(base);

      expect(obj).toEqual([123]);
      expect(obj).not.toBe(base);
    });

    it('supports 2 arrays and creates a new array', () => {
      const base = [123];
      const obj = deepMerge(base, [456, 'abc']);

      expect(obj).toEqual([456, 'abc']);
      expect(obj).not.toBe(base);
    });
  });
});
