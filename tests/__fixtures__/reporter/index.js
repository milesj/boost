const path = require('path');

const Reporter = require(path.join(__dirname, '../../../packages/core/src/Reporter')).default;

module.exports = class TestReporter extends Reporter {
  blueprint({ number }) {
    return {
      fps: number(),
    };
  }
};
