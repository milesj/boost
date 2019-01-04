const BoostReporter = require('../../../packages/core/lib/reporters/BoostReporter').default;

module.exports = {
  reporters: [new BoostReporter(), new BoostReporter(), new BoostReporter()],
};
