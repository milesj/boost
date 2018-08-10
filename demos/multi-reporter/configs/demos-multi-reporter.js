const DefaultReporter = require('../../../lib/reporters/DefaultReporter').default;

module.exports = {
  reporters: [new DefaultReporter(), new DefaultReporter(), new DefaultReporter()],
};
