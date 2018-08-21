const path = require('path');

const Reporter = require(path.join(__dirname, '../../../src/Reporter')).default;

module.exports = class TestReporter extends Reporter {};
