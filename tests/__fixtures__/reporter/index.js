const path = require('path');
const { number } = require('optimal');

const Reporter = require(path.join(__dirname, '../../../packages/core/src/Reporter')).default;

module.exports = class TestReporter extends Reporter {
  blueprint() {
    return {
      fps: number(),
    };
  }
};
