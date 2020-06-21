import * as json from '../../src/serializers/json';

describe('json', () => {
  it('serializes and parses json', () => {
    const data = {
      foo: 123,
      bar: true,
      baz: 'abc',
      qux: {},
    };

    expect(json.parse(json.stringify(data))).toEqual(data);
  });
});
