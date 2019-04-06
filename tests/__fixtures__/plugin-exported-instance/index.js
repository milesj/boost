const path = require('path');

const Plugin = require(path.join(__dirname, '../../../packages/core/src/Plugin')).default;

class TestPlugin extends Plugin {
  blueprint() {
    return {};
  }
}

module.exports = new TestPlugin();
