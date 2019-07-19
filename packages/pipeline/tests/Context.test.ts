/* eslint-disable @typescript-eslint/member-ordering */

import Context from '../src/Context';

describe('Context', () => {
  class TestContext extends Context {
    foo = '';

    bar = 0;

    baz = false;

    qux = () => {};

    fixed: any = null;

    noop() {}
  }

  it('copies property values', () => {
    const ctx = new TestContext();
    ctx.foo = 'abc';
    ctx.bar = 123;
    ctx.baz = true;
    ctx.qux = () => {};

    const clone = ctx.clone();

    expect(clone.foo).toBe('abc');
    expect(clone.bar).toBe(123);
    expect(clone.baz).toBe(true);
    expect(clone.qux).toBe(ctx.qux);
  });

  it('doesnt copy non-enumerable', () => {
    const ctx = new TestContext();

    Object.defineProperty(ctx, 'fixed', {
      enumerable: false,
      value: {},
    });

    const clone = ctx.clone();

    expect(ctx.fixed).toEqual({});
    expect(clone.fixed).toBeNull();
  });

  it('passes constructor values', () => {
    class CtorContext extends Context {
      constructor(cb: () => void) {
        super();

        cb();
      }
    }

    const spy = jest.fn();
    const ctx = new CtorContext(spy);

    ctx.clone(spy);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  describe('arrays', () => {
    class ArrayContext extends Context {
      array: number[] = [];

      constructor(...args: number[]) {
        super();

        this.array.push(...args);
      }
    }

    it('spreads to break references', () => {
      const ctx = new ArrayContext(1, 2, 3);
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.array).not.toBe(ctx.array);

      clone.array.push(4);

      expect(ctx.array).toEqual([1, 2, 3]);
    });
  });

  describe('objects', () => {
    class ObjectContext extends Context {
      object: { [key: string]: string } = {};

      constructor(...values: string[]) {
        super();

        values.forEach(value => {
          this.object[value] = value;
        });
      }
    }

    it('spreads to break references', () => {
      const ctx = new ObjectContext('foo', 'bar', 'baz');
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.object).not.toBe(ctx.object);

      clone.object.qux = 'qux';

      expect(ctx.object).toEqual({ foo: 'foo', bar: 'bar', baz: 'baz' });
    });
  });

  describe('dates', () => {
    class DateContext extends Context {
      date: Date;

      constructor() {
        super();

        this.date = new Date();
      }
    }

    it('creates a new `Date` instance', () => {
      const date = new Date();
      const ctx = new DateContext();
      ctx.date = date;
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.date).not.toBe(ctx.date);

      clone.date.setFullYear(2000);

      expect(ctx.date.getFullYear()).toEqual(new Date().getFullYear());
    });
  });

  describe('maps', () => {
    class MapContext extends Context {
      map: Map<string, string> = new Map();

      constructor(...values: string[]) {
        super();

        values.forEach(value => {
          this.map.set(value, value);
        });
      }
    }

    it('creates a new `Map` instance', () => {
      const ctx = new MapContext('foo', 'bar', 'baz');
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.map).not.toBe(ctx.map);

      clone.map.set('qux', 'qux');

      expect(Array.from(ctx.map.keys())).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('sets', () => {
    class SetContext extends Context {
      set: Set<string> = new Set();

      constructor(...values: string[]) {
        super();

        values.forEach(value => {
          this.set.add(value);
        });
      }
    }

    it('creates a new `Set` instance', () => {
      const ctx = new SetContext('foo', 'bar', 'baz');
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.set).not.toBe(ctx.set);

      clone.set.add('qux');

      expect(Array.from(ctx.set.keys())).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('classes', () => {
    class Test {
      name: string;

      flag: boolean = false;

      constructor(name: string) {
        this.name = name;
      }
    }

    class ClassContext extends Context {
      instance: Test;

      constructor(instance: Test) {
        super();

        this.instance = instance;
      }
    }

    it('doesnt spread and persists references', () => {
      const inst = new Test('foo');
      const ctx = new ClassContext(inst);
      const clone = ctx.clone();

      expect(clone).toEqual(ctx);
      expect(clone).not.toBe(ctx);
      expect(clone.instance).toBe(ctx.instance);
      expect(clone.instance).toBe(inst);

      clone.instance.flag = true;

      expect(ctx.instance.flag).toBe(true);
    });
  });
});
