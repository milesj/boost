const path = require('path');

const Plugin = require(path.join(__dirname, '../../../src/Plugin')).default;

module.exports = new Plugin();
