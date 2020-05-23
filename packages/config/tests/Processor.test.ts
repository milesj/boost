import { predicates, Blueprint, Path } from '@boost/common';
import Processor from '../src/Processor';
import { ConfigFile, PluginsSetting, ExtendsSetting } from '../src/types';
import { extendsSetting, pluginsSetting } from '../src/blueprints';
import overwrite from '../src/helpers/overwrite';
import mergeExtends from '../src/helpers/mergeExtends';

describe('Processor', () => {
  interface ConfigShape {
    // Standard
    debug: boolean;
    extends: ExtendsSetting;
    plugins: PluginsSetting;
    // Types
    boolean: boolean;
    string: string;
    stringList: string[];
    number: number;
    numberList: number[];
    object: object;
  }

  let processor: Processor<ConfigShape>;

  function stubConfigFile(config: Partial<ConfigShape>): ConfigFile<ConfigShape> {
    return {
      config,
      path: new Path('.boost.js'),
      source: 'branch',
    };
  }

  beforeEach(() => {
    processor = new Processor({ name: 'boost' });
  });

  describe('handlers', () => {
    it('sets a handler', () => {
      const spy = jest.fn();
      processor.addHandler('debug', spy);

      expect(processor.getHandler('debug')).toBe(spy);
    });

    it('overwrites a handler of the same name', () => {
      const spy1 = jest.fn();
      processor.addHandler('debug', spy1);

      const spy2 = jest.fn();
      processor.addHandler('debug', spy2);

      expect(processor.getHandler('debug')).toBe(spy2);
    });

    it('returns null if not defined', () => {
      expect(processor.getHandler('debug')).toBeNull();
    });
  });

  describe('processing', () => {
    const blueprint: Blueprint<ConfigShape> = {
      debug: predicates.bool(false),
      extends: extendsSetting,
      plugins: pluginsSetting,
      boolean: predicates.bool(true),
      string: predicates.string(''),
      stringList: predicates.array(predicates.string(), ['foo']),
      number: predicates.number(123),
      numberList: predicates.array(predicates.number(), []),
      object: predicates.object(),
    };

    const defaults: ConfigShape = {
      debug: false,
      extends: [],
      plugins: {},
      boolean: true,
      string: '',
      stringList: ['foo'],
      number: 123,
      numberList: [],
      object: {},
    };

    it('returns defaults if no configs', async () => {
      expect(await processor.process(defaults, [], blueprint)).toEqual(defaults);
    });

    describe('undefined values', () => {
      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
            blueprint,
          ),
        ).toEqual(defaults);
      });

      it('does not reset to default if `defaultWhenUndefined` option is false', async () => {
        processor.configure({ defaultWhenUndefined: false });

        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          debug: undefined,
        });
      });
    });

    describe('validation', () => {
      it('validates each config', async () => {
        await expect(
          processor.process(
            defaults,
            [
              stubConfigFile({ debug: true }),
              stubConfigFile({
                // @ts-ignore Allow
                debug: 123,
              }),
            ],
            blueprint,
          ),
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      it('doesnt validate if the `validate` option is false', async () => {
        processor.configure({ validate: false });

        await expect(
          processor.process(
            defaults,
            [
              stubConfigFile({ debug: true }),
              stubConfigFile({
                // @ts-ignore Allow
                debug: 123,
              }),
            ],
            blueprint,
          ),
          // eslint-disable-next-line jest/no-expect-resolves
        ).resolves.not.toThrow();
      });
    });

    describe('extends settings', () => {
      it('supports extends from multiple configs', async () => {
        processor.addHandler('extends', mergeExtends);

        expect(
          await processor.process(
            defaults,
            [
              stubConfigFile({ extends: 'foo' }),
              stubConfigFile({ extends: ['bar', './baz.js'] }),
              stubConfigFile({ extends: '/qux.js' }),
            ],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          extends: ['foo', 'bar', './baz.js', '/qux.js'],
        });
      });

      it('errors for an empty string', async () => {
        await expect(
          processor.process(defaults, [stubConfigFile({ extends: '' })], blueprint),
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      it('errors for an empty string in an array', async () => {
        await expect(
          processor.process(defaults, [stubConfigFile({ extends: ['foo', ''] })], blueprint),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });

    describe('booleans', () => {
      it('can overwrite', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ debug: true }), stubConfigFile({ boolean: false })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          debug: true,
          boolean: false,
        });
      });

      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ debug: true }), stubConfigFile({ debug: undefined })],
            blueprint,
          ),
        ).toEqual(defaults);
      });
    });

    describe('strings', () => {
      it('can overwrite', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ string: 'foo' }), stubConfigFile({ string: 'bar' })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          string: 'bar',
        });
      });

      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ string: 'foo' }), stubConfigFile({ string: undefined })],
            blueprint,
          ),
        ).toEqual(defaults);
      });
    });

    describe('numbers', () => {
      it('can overwrite', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ number: 123 }), stubConfigFile({ number: 456 })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          number: 456,
        });
      });

      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ number: 999 }), stubConfigFile({ number: undefined })],
            blueprint,
          ),
        ).toEqual(defaults);
      });
    });

    describe('arrays', () => {
      it('merges and flattens by default', async () => {
        expect(
          await processor.process(
            defaults,
            [
              stubConfigFile({ stringList: ['foo', 'bar'] }),
              stubConfigFile({ stringList: [] }),
              stubConfigFile({ stringList: ['bar', 'baz'] }),
            ],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          stringList: ['foo', 'bar', 'baz'],
        });
      });

      it('can overwrite using a custom handler', async () => {
        processor.addHandler('numberList', overwrite);

        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ numberList: [1, 2, 3] }), stubConfigFile({ numberList: [4, 5, 6] })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          numberList: [4, 5, 6],
        });
      });

      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [
              stubConfigFile({ stringList: ['foo', 'bar', 'baz'] }),
              stubConfigFile({ stringList: undefined }),
            ],
            blueprint,
          ),
        ).toEqual(defaults);
      });
    });

    describe('objects', () => {
      it('shallow merges by default', async () => {
        expect(
          await processor.process(
            defaults,
            [
              stubConfigFile({ object: { foo: 123, nested: { a: true }, baz: false } }),
              stubConfigFile({ object: {} }),
              stubConfigFile({ object: { foo: 456, nested: { b: true }, bar: 'abc' } }),
            ],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          object: { foo: 456, nested: { b: true }, bar: 'abc', baz: false },
        });
      });

      it('can overwrite using a custom handler', async () => {
        processor.addHandler('object', overwrite);

        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ object: { foo: 123 } }), stubConfigFile({ object: { bar: 456 } })],
            blueprint,
          ),
        ).toEqual({
          ...defaults,
          object: { bar: 456 },
        });
      });

      it('can reset to default using undefined', async () => {
        expect(
          await processor.process(
            defaults,
            [stubConfigFile({ object: { bar: 456 } }), stubConfigFile({ object: undefined })],
            blueprint,
          ),
        ).toEqual(defaults);
      });
    });
  });
});
