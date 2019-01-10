const path = require('path');
const { string, number, bool } = require('optimal');

const Plugin = require(path.join(__dirname, '../../../src/Plugin')).default;

module.exports = class TestPlugin extends Plugin {
  blueprint() {
    return {
      foo: string().empty(),
      bar: bool(),
      baz: number(),
    };
  }
};
