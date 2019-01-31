const path = require('path');

const Plugin = require(path.join(__dirname, '../../../packages/core/src/Plugin')).default;

module.exports = class TestPlugin extends Plugin {
  blueprint({ string, bool, number }) {
    return {
      foo: string(),
      bar: bool(),
      baz: number(),
    };
  }
};
