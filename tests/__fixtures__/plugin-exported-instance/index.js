const path = require('path');

const Plugin = require(path.join(__dirname, '../../../packages/core/src/Plugin')).default;

module.exports = new Plugin();
