const DefaultReporter = require('../../../packages/core/lib/reporters/DefaultReporter').default;

module.exports = {
  reporters: [new DefaultReporter(), new DefaultReporter(), new DefaultReporter()],
};
